@echo off
echo Building C# Bridge for Blazor WebAssembly...
echo.
echo Requirements:
echo   - .NET 8 SDK with wasm-tools workload
echo.
echo Installing wasm-tools workload (if not already installed)...
dotnet workload install wasm-tools 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install wasm-tools workload.
    echo Please install manually: dotnet workload install wasm-tools
    exit /b 1
)

echo.
echo Restoring packages...
dotnet restore CSharpBridge\CSharpBridge.csproj
if %ERRORLEVEL% NEQ 0 (
    echo Restore failed.
    exit /b 1
)

echo.
echo Publishing C# Bridge...
dotnet publish CSharpBridge\CSharpBridge.csproj -c Release -o public\_framework\
if %ERRORLEVEL% NEQ 0 (
    echo Publish failed.
    exit /b 1
)

echo.
echo C# Bridge built successfully!
echo The compiled WASM files are in public\_framework\
echo.
echo You can now run: npm run dev