SETUP_SERVER:
ssh root@173.249.55.127 => password
ON_LOCAL_MACHINE:
  ssh-keygen 
  ssh-copy-id skymi@173.249.55.127  password for skymi is 0511
LOGIN_WITH: ssh skymi@173.249.55.127
INSTALL_NODE:
 NVM: wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
 Open new tab
 nvm install 10
 YOU MAY NEED : sudo apt install python2.7 python-pip
REDIS :
  sudo apt update
  sudo apt install redis-server
  edit : /etc/redis/redis.conf uncomment socket and comment 127.0.0.1
  unixsocket /var/run/redis/redis-server.sock
  unixsocketperm 777

  sudo systemctl status redis
  sudo systemctl restart redis
  test with: redis-cli -s /var/run/redis/redis-server.sock
	### TROUBLESHOOTING ##
        sudo touch /var/run/redis/redis-server.sock
        sudo chmod 777 /var/run/redis/redis-server.sock
        sudo usermod -a -G redis www-data
        sudo usermod -g www-data redis
        sudo mkdir -p /var/run/redis
        sudo chown -R redis:www-data /var/run/redis
        sudo systemctl restart redis
PM2
    pm2 start ecosystem.config.js
    pm2 startup
    pm2 save

SSL Certificate : https://www.ssls.com/
      export NODE_ENV='production' // no dev and test stuff
      https://expressjs.com/en/advanced/best-practice-performance.html#run-your-app-in-a-cluster
      https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
      https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04
      https://www.digitalocean.com/community/tutorials/how-to-setup-a-firewall-with-ufw-on-an-ubuntu-and-debian-cloud-server
      //pm2 start app.js -i 0  deprecated
        pm2 start ecosystem.config.js
        pm2 startup
        copy and run command : 
        sudo env PATH=$PATH:/home/dev/.nvm/versions/node/v10.13.0/bin /home/dev/.nvm/versions/node/v10.13.0/lib/node_modules/pm2/bin/pm2 startup systemd -u dev --hp /home/dev
        pm2 save
NginX
      sudo apt update
      sudo apt install nginx  
      sudo apt-get install ufw
      sudo ufw app list
      sudo vim /etc/nginx/sites-available/default :

server {
        listen 80;
        server_name form-api.com www.form-api.com;
        return 301 https://form-api.com$request_uri;
			}
server {
        server_name www.form-api.com;
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        return 301 https://form-api.com$request_uri;
			}
upstream the_api {
    		server 127.0.0.1:3000;
    		keepalive 64;
		}
server {
        server_name form-api.com;
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        ssl_session_cache shared:SSL:20m;
        ssl_session_timeout 60m;
        ssl_prefer_server_ciphers on;
        ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DHE+AES128:!ADH:!AECDH:!MD5;
#        ssl_dhparam /etc/nginx/cert/dhparam.pem;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
#        ssl_stapling on;
#        ssl_stapling_verify on;
#        ssl_trusted_certificate /etc/nginx/cert/trustchain.crt;
#        resolver 8.8.8.8 8.8.4.4;
        #add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Strict-Transport-Security "max-age=31536000" always;
        location / {
                proxy_pass https://formapimultiweb.herokuapp.com/;
        }
        location /api/ {
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_max_temp_file_size 0;
                proxy_pass http://the_api/;
                proxy_redirect off;
                proxy_read_timeout 240s;
        }

}

cat form-api_com.crt COMODORSAAddTrustCA.crt COMODORSADomainValidationSecureServerCA.crt >> bundle.crt

dev@vmi192921:~/formapimulti$ sudo cp ssl/form-api.key /etc/nginx/ssl/
dev@vmi192921:~/formapimulti$ sudo cp ssl/form-api_com/bundle.crt /etc/nginx/ssl/
sudo vim /etc/nginx/sites-available/default
sudo systemctl restart nginx

Godaddy :

  Type   Name   Value             TTL                   Actions
    A     @     173.249.55.127  600 seconds               Edit
    A     www   173.249.55.127  1/2 Hour                  Edit 


      sudo service nginx restart

      NginX logs sudo tail -30 /var/log/nginx/error.log


SSL 

sky@sky:~$ openssl req -new -newkey rsa:2048 -nodes -keyout form-api.key -out form-api.csr

Generating a 2048 bit RSA private key
.....+++
.............+++
writing new private key to 'form-api.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CA
Locality Name (eg, city) []:San Jose
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Form-API.com
Organizational Unit Name (eg, section) []:admin
Common Name (e.g. server FQDN or YOUR name) []:form-api.com
Email Address []:support@form-api.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:0511
An optional company name []:Form-API.com
https://mozilla.github.io/server-side-tls/ssl-config-generator/
 -------------------------------------------ssl for support@form-api.com  ----------------------------------------------------------
-------------------------------------------comodo user khalidrahmani skY0511!co---------------------------------------------------
https://www.digitalocean.com/community/tutorials/how-to-increase-pagespeed-score-by-changing-your-nginx-configuration-on-ubuntu-16-04

#SETUP PAGESPEED
https://www.modpagespeed.com/doc/build_ngx_pagespeed_from_source
                                       
bash <(curl -f -L -sS https://ngxpagespeed.com/install) \
     --nginx-version latest

When error : sudo apt-get install libssl-dev


sudo mkdir -p /var/cache/nginx/client_temp
sudo mkdir -p /var/ngx_pagespeed_cache
sudo chown -R www-data:www-data /var/ngx_pagespeed_cache or sudo chown -R nginx:nginx /var/ngx_pagespeed_cache

sudo nginx -t
