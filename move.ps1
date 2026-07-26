New-Item -ItemType Directory -Path "src\app\[locale]" -Force
Move-Item -Path "src\app\page.tsx" -Destination "src\app\[locale]\"
Move-Item -Path "src\app\layout.tsx" -Destination "src\app\[locale]\"
Move-Item -Path "src\app\dashboard" -Destination "src\app\[locale]\"
Move-Item -Path "src\app\login" -Destination "src\app\[locale]\"
Move-Item -Path "src\app\admin" -Destination "src\app\[locale]\"
