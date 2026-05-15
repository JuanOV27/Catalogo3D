@echo off
title Catalogo 3D - Spring Boot
color 0A

echo =============================================
echo   CATALOGO DE ARTICULOS IMPRESOS EN 3D
echo =============================================
echo.

:: Verificar MongoDB
echo [1/2] Verificando MongoDB...
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel%==0 (
    echo       MongoDB ya esta corriendo. OK
) else (
    echo       Iniciando servicio MongoDB...
    net start MongoDB >nul 2>&1
    if %errorlevel%==0 (
        echo       MongoDB iniciado. OK
    ) else (
        echo.
        echo [!] No se pudo iniciar MongoDB automaticamente.
        echo     Inicia MongoDB manualmente y vuelve a ejecutar este script.
        echo     (Puede requerir ejecutar como Administrador)
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Iniciando Spring Boot en http://localhost:8080
echo.
echo  Endpoints disponibles:
echo    POST   /api/auth/login
echo    GET    /api/articulos
echo    POST   /api/articulos
echo    PUT    /api/articulos/{id}
echo    DELETE /api/articulos/{id}
echo    GET    /api/categorias
echo    POST   /api/categorias
echo    POST   /api/clientes
echo    POST   /api/admins/init
echo.
echo  Presiona Ctrl+C para detener el servidor.
echo =============================================
echo.

set MVN=C:\tools\apache-maven-3.9.6\bin\mvn.cmd
set PROJECT=%~dp0

"%MVN%" -f "%PROJECT%pom.xml" spring-boot:run

pause
