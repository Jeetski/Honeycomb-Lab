@echo off
setlocal
color 0a
title Auto Deployer

REM Auto deploy script: stage, commit, push, then trigger GitHub Actions with an empty commit
set "MAIN_MSG=auto deployed"
set "TRIGGER_MSG=chore: trigger GitHub Actions"
if not "%~1"=="" set "MAIN_MSG=%~1"

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
set COMMITTED=0
git commit -m "%MAIN_MSG%" && set COMMITTED=1
if %COMMITTED%==0 (
  echo [INFO] No content changes to commit. Continuing.
)

if %COMMITTED%==1 (
  echo [3/5] Pushing current branch (%BRANCH%)...
  git push origin "%BRANCH%"
  if errorlevel 1 (
    echo [ERROR] Push failed.
    exit /b 1
  )
) else (
  echo [3/5] Skipping first push (no content commit).
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
