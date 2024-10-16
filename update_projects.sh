#!/bin/bash

# المشروع الذي يحتوي على التغييرات
source_project="J:/cartoon - Copy"

# قائمة المخازن الأخرى
repos=(
    "J:/cloudflare/cloudflare_repo1"
    "J:/cloudflare/cloudflare_repo2"
    "J:/cloudflare/cloudflare_repo3"
    "J:/cloudflare/cloudflare_repo4"
    "J:/cloudflare/cloudflare_repo5"
    "J:/cloudflare/cloudflare_repo6"
    "J:/cloudflare/cloudflare_repo7"
    "J:/cloudflare/cloudflare_repo8"
    "J:/cloudflare/cloudflare_repo9"
    "J:/cloudflare/cloudflare_repo10"
    "J:/cloudflare/cloudflare_repo11"
    "J:/cloudflare/cloudflare_repo12"
    "J:/cloudflare/cloudflare_repo13"
    "J:/cloudflare/cloudflare_repo14"
    "J:/cloudflare/cloudflare_repo15"
    # ... إضافة باقي المخازن هنا
)

# نسخ التغييرات مع استثناء المجلدات .git و .vercel واستبدال الملفات بالكامل
for repo in "${repos[@]}"; do
    # استخدام rsync مع خيار --delete لحذف الملفات غير الموجودة في المصدر، مع استثناء مجلدات .vercel و .git
    rsync -av --delete --exclude='.git' --exclude='.vercel' "$source_project/" "$repo/"

    # التحقق من نجاح العملية
    if [ $? -eq 0 ]; then
        echo "Successfully updated $repo with changes from $source_project, excluding .git and .vercel directories."
    else
        echo "Failed to update $repo. Please check for errors."
    fi
done
