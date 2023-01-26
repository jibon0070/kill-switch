cd app || exit
yarn run build
cd dist || exit
tar -czvf ../../app.tar.gz *


cd ../../server || exit
tar -czvf ../server.tar.gz dist package.json run.sh
cd .. || exit

scp app.tar.gz murad@billing.mediaonlinebd.com:/var/www/backup
scp server.tar.gz murad@billing.mediaonlinebd.com:/var/www/backup

ssh murad@billing.mediaonlinebd.com << "ENDSSH"
cd /var/www/backup
cd app
rm -rf *
cd ..
tar -C ./app -xzvf app.tar.gz
tar -C ./server -xzvf server.tar.gz
rm -rf app.tar.gz
rm -rf server.tar.gz
cd server
./run.sh
ENDSSH

rm app.tar.gz
rm server.tar.gz