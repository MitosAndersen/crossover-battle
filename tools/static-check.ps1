# Static error check for the game JS files (ASCII only; path passed as arg)
param([Parameter(Mandatory=$true)][string]$Root)
$ErrorActionPreference = 'Stop'
$problems = New-Object System.Collections.Generic.List[string]

# ---- 1. brace/bracket/paren + string balance scan (string/comment aware) ----
function Check-Balance([string]$file) {
    $text = [System.IO.File]::ReadAllText((Join-Path $Root $file), [System.Text.Encoding]::UTF8)
    $stack = New-Object System.Collections.Generic.Stack[object]
    $line = 1
    $mode = 'code'
    $strLine = 0
    $pairs = @{ '}' = '{'; ']' = '['; ')' = '(' }
    for ($i = 0; $i -lt $text.Length; $i++) {
        $c = [string]$text[$i]
        $n = if ($i + 1 -lt $text.Length) { [string]$text[$i+1] } else { '' }
        if ($c -eq "`n") { $line++ }
        if ($mode -eq 'code') {
            if ($c -eq '/' -and $n -eq '/') { $mode = 'lineC'; $i++ }
            elseif ($c -eq '/' -and $n -eq '*') { $mode = 'blockC'; $i++ }
            elseif ($c -eq [string][char]39) { $mode = 'sq'; $strLine = $line }
            elseif ($c -eq [string][char]34) { $mode = 'dq'; $strLine = $line }
            elseif ($c -eq [string][char]96) { $mode = 'bt'; $strLine = $line }
            elseif ($c -eq '{' -or $c -eq '[' -or $c -eq '(') { $stack.Push(@($c, $line)) }
            elseif ($c -eq '}' -or $c -eq ']' -or $c -eq ')') {
                if ($stack.Count -eq 0) { $problems.Add("$file : line $line unexpected '$c'"); return }
                $top = $stack.Pop()
                if ($top[0] -ne $pairs[$c]) { $problems.Add("$file : line $line '$c' does not match '$($top[0])' opened at line $($top[1])"); return }
            }
        }
        elseif ($mode -eq 'sq') {
            if ($c -eq '\') { $i++ }
            elseif ($c -eq [string][char]39) { $mode = 'code' }
            elseif ($c -eq "`n") { $problems.Add("$file : line $strLine unterminated single-quote string"); $mode = 'code' }
        }
        elseif ($mode -eq 'dq') {
            if ($c -eq '\') { $i++ }
            elseif ($c -eq [string][char]34) { $mode = 'code' }
            elseif ($c -eq "`n") { $problems.Add("$file : line $strLine unterminated double-quote string"); $mode = 'code' }
        }
        elseif ($mode -eq 'bt') {
            if ($c -eq '\') { $i++ }
            elseif ($c -eq [string][char]96) { $mode = 'code' }
        }
        elseif ($mode -eq 'lineC') { if ($c -eq "`n") { $mode = 'code' } }
        elseif ($mode -eq 'blockC') { if ($c -eq '*' -and $n -eq '/') { $mode = 'code'; $i++ } }
    }
    if ($stack.Count -gt 0) { $top = $stack.Peek(); $problems.Add("$file : '$($top[0])' opened at line $($top[1]) never closed") }
    if ($mode -eq 'bt') { $problems.Add("$file : unterminated backtick string") }
}
foreach ($f in @('characters.js','skills.js','battle.js','ui.js','main.js','passives.js','relics.js','achievements.js','audio.js')) { Check-Balance $f }
Write-Host ("balance scan done, problems: " + $problems.Count)

# ---- 2. reference integrity ----
$chars  = [System.IO.File]::ReadAllText((Join-Path $Root 'characters.js'), [System.Text.Encoding]::UTF8)
$skills = [System.IO.File]::ReadAllText((Join-Path $Root 'skills.js'), [System.Text.Encoding]::UTF8)
$pass   = [System.IO.File]::ReadAllText((Join-Path $Root 'passives.js'), [System.Text.Encoding]::UTF8)

function Get-Block([string]$text, [string]$name, [string]$open, [string]$close) {
    $s = $text.IndexOf("const $name = $open")
    if ($s -lt 0) { throw "not found: $name" }
    $e = $text.IndexOf("`n$close;", $s)
    if ($e -lt 0) { throw "end not found: $name" }
    return $text.Substring($s, $e - $s)
}
function Get-Keys([string]$block) {
    return [regex]::Matches($block, "(?m)^\s{2}(\w+)\s*:") | ForEach-Object { $_.Groups[1].Value }
}

$skillKeys   = Get-Keys (Get-Block $skills 'SKILL_DATA' '{' '}')
$eSkillKeys  = Get-Keys (Get-Block $chars 'ENEMY_SKILL_DATA' '{' '}')
$joinKeys    = Get-Keys (Get-Block $chars 'JOIN_QUOTES' '{' '}')
$sqKeys      = Get-Keys (Get-Block $chars 'SKILL_QUOTES' '{' '}')
$bsqKeys     = Get-Keys (Get-Block $chars 'BOSS_SKILL_QUOTES' '{' '}')
$tierKeys    = @()
if ($chars.Contains('const CHAR_TIERS = {')) {
    $tierKeys = [regex]::Matches((Get-Block $chars 'CHAR_TIERS' '{' '}'), "(\w+)\s*:\s*\d") | ForEach-Object { $_.Groups[1].Value }
}
$passKeys    = Get-Keys (Get-Block $pass 'PASSIVE_DATA' '{' '}')

$allyBlock   = Get-Block $chars 'ALLY_DATA' '[' ']'
$enemyBlocks = (Get-Block $chars 'ENEMY_DATA' '[' ']') + (Get-Block $chars 'BOSS_DATA' '[' ']') + (Get-Block $chars 'MIDBOSS_DATA' '[' ']')

$allyIds  = [regex]::Matches($allyBlock, "id:\s*'(\w+)'") | ForEach-Object { $_.Groups[1].Value }
$enemyIds = [regex]::Matches($enemyBlocks, "id:\s*'(\w+)'") | ForEach-Object { $_.Groups[1].Value }
$allyIds | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $problems.Add("ALLY_DATA duplicate id: " + $_.Name) }

$skillSet  = New-Object System.Collections.Generic.HashSet[string]; $skillKeys  | ForEach-Object { [void]$skillSet.Add($_) }
$eSkillSet = New-Object System.Collections.Generic.HashSet[string]; $eSkillKeys | ForEach-Object { [void]$eSkillSet.Add($_) }
$allySet   = New-Object System.Collections.Generic.HashSet[string]; $allyIds    | ForEach-Object { [void]$allySet.Add($_) }
$enemySet  = New-Object System.Collections.Generic.HashSet[string]; $enemyIds   | ForEach-Object { [void]$enemySet.Add($_) }

foreach ($m in [regex]::Matches($allyBlock, "id:\s*'(\w+)'[^\r\n]*skillIds:\s*\[([^\]]*)\]")) {
    $cid = $m.Groups[1].Value
    foreach ($mm in [regex]::Matches($m.Groups[2].Value, "'(\w+)'")) {
        if (-not $skillSet.Contains($mm.Groups[1].Value)) { $problems.Add("ally $cid -> missing skill in SKILL_DATA: " + $mm.Groups[1].Value) }
    }
}
foreach ($m in [regex]::Matches($enemyBlocks, "id:\s*'(\w+)'[^\r\n]*skillIds:\s*\[([^\]]*)\]")) {
    $cid = $m.Groups[1].Value
    foreach ($mm in [regex]::Matches($m.Groups[2].Value, "'(\w+)'")) {
        if (-not $eSkillSet.Contains($mm.Groups[1].Value)) { $problems.Add("enemy $cid -> missing skill in ENEMY_SKILL_DATA: " + $mm.Groups[1].Value) }
    }
}
foreach ($m in [regex]::Matches($enemyBlocks, "id:\s*'(\w+)'[^\r\n]*chargeSkillId:\s*'(\w+)'")) {
    if (-not $eSkillSet.Contains($m.Groups[2].Value)) { $problems.Add("enemy " + $m.Groups[1].Value + " -> missing chargeSkill: " + $m.Groups[2].Value) }
}
foreach ($k in $joinKeys) { if (-not $allySet.Contains($k)) { $problems.Add("JOIN_QUOTES orphan: $k") } }
foreach ($k in $tierKeys) { if (-not $allySet.Contains($k)) { $problems.Add("CHAR_TIERS orphan: $k") } }
foreach ($k in $sqKeys)   { if (-not $skillSet.Contains($k)) { $problems.Add("SKILL_QUOTES orphan: $k") } }
foreach ($k in $bsqKeys)  { if (-not $eSkillSet.Contains($k)) { $problems.Add("BOSS_SKILL_QUOTES orphan: $k") } }
foreach ($k in $passKeys) { if (-not $allySet.Contains($k) -and -not $enemySet.Contains($k)) { $problems.Add("PASSIVE_DATA orphan: $k") } }

$usedSkills = New-Object System.Collections.Generic.HashSet[string]
foreach ($m in [regex]::Matches($allyBlock, "skillIds:\s*\[([^\]]*)\]")) {
    foreach ($mm in [regex]::Matches($m.Groups[1].Value, "'(\w+)'")) { [void]$usedSkills.Add($mm.Groups[1].Value) }
}
$unused = @($skillKeys | Where-Object { -not $usedSkills.Contains($_) })

# ---- 3. unknown status/effect names ----
# battle.js の applyStatusEffect は未知の効果名を弾かず statusEffects にそのまま積む。
# そのため curse を cruse と打ち間違えても例外は出ず、
#   - 毎ターンの処理が type 一致しないので何も起きない
#   - dispel/解除の対象リストにも入らないので消せない
#   - スキルボタンには EFFECT_LABELS[x] || x で英字のまま表示される
# という「静かに壊れる」状態になる。実際に虎杖悠仁のスキルで発生した。
# 正解リストは ui.js の EFFECT_LABELS（表示の実体）から取る。
$uiText = [System.IO.File]::ReadAllText((Join-Path $Root 'ui.js'), [System.Text.Encoding]::UTF8)
$labelMatch = [regex]::Match($uiText, "(?s)const EFFECT_LABELS = \{(.*?)\};")
$validEffects = New-Object System.Collections.Generic.HashSet[string]
if ($labelMatch.Success) {
    foreach ($m in [regex]::Matches($labelMatch.Groups[1].Value, "(\w+)\s*:\s*'")) { [void]$validEffects.Add($m.Groups[1].Value) }
} else {
    $problems.Add("ui.js : EFFECT_LABELS not found (effect name check skipped)")
}
# EFFECT_LABELS に無いが正規に扱われるもの。
# barrier は buildSkillEffectLines が専用の分岐で文言を出すため表に無くてよい。
[void]$validEffects.Add('barrier')

$unknownEffects = New-Object System.Collections.Generic.List[string]
foreach ($ef in @('skills.js','characters.js','passives.js','relics.js')) {
    $etext = [System.IO.File]::ReadAllText((Join-Path $Root $ef), [System.Text.Encoding]::UTF8)
    $elines = [regex]::Split($etext, "\r?\n")
    for ($k = 0; $k -lt $elines.Count; $k++) {
        $ln = $elines[$k]
        # effect:'x' / alsoEffect2:'x' / alsoEffect3:'x' / selfEffect:'x' / buff:'x'
        foreach ($m in [regex]::Matches($ln, "(?:effect|alsoEffect2|alsoEffect3|selfEffect|buff)\s*:\s*'(\w+)'")) {
            $v = $m.Groups[1].Value
            if (-not $validEffects.Contains($v)) { $unknownEffects.Add($ef + " : line " + ($k+1) + " unknown effect '" + $v + "'") }
        }
        # buffs:['atk_up','def_up'] / targets:['stun',...] のような配列も見る
        foreach ($m in [regex]::Matches($ln, "(?:buffs|targets)\s*:\s*\[([^\]]*)\]")) {
            foreach ($mm in [regex]::Matches($m.Groups[1].Value, "'(\w+)'")) {
                $v = $mm.Groups[1].Value
                if (-not $validEffects.Contains($v)) { $unknownEffects.Add($ef + " : line " + ($k+1) + " unknown effect '" + $v + "'") }
            }
        }
    }
}
foreach ($u in $unknownEffects) { $problems.Add($u) }

Write-Host ("effect names: valid=" + $validEffects.Count + " unknown=" + $unknownEffects.Count)
Write-Host ("counts: allies=" + @($allyIds).Count + " enemies=" + @($enemyIds).Count + " skills=" + @($skillKeys).Count + " enemySkills=" + @($eSkillKeys).Count)
Write-Host ("PROBLEMS: " + $problems.Count)
foreach ($p in $problems) { Write-Host ("  NG " + $p) }
Write-Host ("unused ally skills (dead data, not an error): " + $unused.Count)
foreach ($u in $unused) { Write-Host ("  unused: " + $u) }
