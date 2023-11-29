## Before start the project

Install [IntelliJ IDEA](https://www.jetbrains.com/ru-ru/idea/download/?section=windows) on you computer

Install [Node](https://nodejs.org/en/blog/release/v18.12.0) on you computer.

Install [Redis](https://redis.io/docs/install/install-redis/) on you computer.

Go to [MySQL](http://owu.linkpc.net/mysql) and click create, come up with a username and password. The password will 
become yours MYSQL_PASSWORD and username MYSQL_USER / MYSQL_DATABASE in .env files.

Download [dumpt](https://drive.google.com/file/d/1_5elESLEi3Lb_QFgDoo2NNsiP-n5O0Ow/view) with the orders document

Go to IntelliJ IDEA > File > New > Project from Version Control > URL > 'paste url from GitHub'

Data Base connection: inside IntelliJ IDEA in the upper right corner, click on Database > + > Data Source > MySQL

In the open window, fill in the fields:
 - host = http://owu.linkpc.net
 - port = 3306
 - user = 'the name you entered'
 - password = 'the password you entered'

Then right mouse click on you database > SQL Scripts > Run SQL Scripts > 'choose dump file'

Start your redis server with command in ubuntu - sudo service redis-server start
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Just step

```bash
# to create admin go POST to this url, or open database > user > and write it manually
$ http://localhost:5000/create/admin

# to see swagger API
$ http://localhost:5000/crm/api
```

## Stay in touch

- Author - [Sasha Kukurika](https://www.linkedin.com/in/sasha-kukurika-ab452618a/)
- [LinkedIn](https://www.linkedin.com/in/sasha-kukurika-ab452618a/)
- [GitHub](https://github.com/SashaKukurika)
