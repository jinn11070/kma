1. mariadb 설치하세용. 접속 정보는 아래와 같습니다.

dataSource:
    pooled: true
    jmxExport: true
    driverClassName: com.mysql.jdbc.Driver
    dialect: org.hibernate.dialect.MySQL5InnoDBDialect
    username: root
    password:
    ip: localhost
    port: 3307
    devDB: kmaDev

2. create/insert는 {rootPath}/sql 파일 안에 있는 sql 파일을 이용하세요.
3. bootRun 하신다음에 설정하신 포트로 보시면 됩니다. 포트등 dataSource 정보 수정은 application.yml 에서 하세요.