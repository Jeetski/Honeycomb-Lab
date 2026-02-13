@echo off
setlocal

REM Auto deploy script: stage, commit, push, then trigger GitHub Actions with an empty commit
set "MAIN_MSG=auto deployed"
set "TRIGGER_MSG=chore: trigger GitHub Actions"

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%b"
if "%BRANCH%"=="" (
  echo [ERROR] Could not determine current git branch.
  exit /b 1
)

echo [1/5] Staging all changes...
git add -A
if errorlevel 1 (
  echo [ERROR] git add failed.
  exit /b 1
)

echo [2/5] Creating content commit...
git commit -m "%MAIN_MSG%"
if errorlevel 1 (
  echo [INFO] No content changes to commit. Continuing.
)

echo [3/5] Pushing current branch (%BRANCH%)...
git push origin "%BRANCH%"
if errorlevel 1 (
  echo [ERROR] Push failed.
  exit /b 1
)

echo [4/5] Creating empty trigger commit...
git commit --allow-empty -m "%TRIGGER_MSG%"
if errorlevel 1 (
  echo [ERROR] Empty trigger commit failed.
  exit /b 1
)

echo [5/5] Pushing trigger commit...
git push origin "%BRANCH%"
if errorlevel 1 (
  echo [ERROR] Push of trigger commit failed.
  exit /b 1
)

echo [DONE] Auto deploy complete.
exit /b 0