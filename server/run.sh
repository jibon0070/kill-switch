cd /var/www/backup/server || exit
pm2 delete 8000

pm2 start dist/index.js --name 8000