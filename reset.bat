@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /PID %%a /F
)
echo All processes using port 7700 have been terminated.