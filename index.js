
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');
var ping = require('ping');
var mysql = require('mysql');
// var hosts = ['192.168.99.104', 'google.com', 'yahoo.com'];
const hosts = [];
let status;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ping_monitor"
});

con.connect(function(err) {
  if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM ip_address", function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        result.forEach( ip => {
                // ip = ip, ip.status ='null';
               hosts.push(ip);
            //    console.log(ip);
               
        });
        console.log(hosts);
    });
});


  const timer = setIntervalAsync(async () => {
    // console.log('Hello')
    hosts.forEach(function(host){
        ping.sys.probe(host.ip, function(isAlive){
            // var msg = isAlive ? 'host ' + host.nama + ' is alive' : 'host ' + host.nama + ' is dead';
            // console.log(msg);

            if(isAlive){
                // console.log('host ' + host.id + ' is alive');
                status = "connected";
                if(status != host.status){
                    setUpdate(host.id,host.ip,status);
                    host.status = "connected";
                }

            }else{
                // console.log('host ' + host.id + ' is dead');
                status = "lost";
                if(status != host.status){
                    setUpdate(host.id,host.ip,status);
                    host.status = "lost";
                }
            }

        });
    });
    // console.log(hosts);
    // console.log('Bye')
  }, 5000);
  

  function setUpdate(id,ip,status){
    console.log(id);
    console.log(status);
    status = status;
        var sqlupdt = `UPDATE ip_address SET status = '`+status+`' WHERE id = '`+id+`' `;
        con.query(sqlupdt, function (err, result) {
            if (err) throw err;
            // console.log(result.affectedRows + " record(s) updated");
            // console.log(result);
        });

        var sqlinsrt = `INSERT INTO log_ip_connection (id_ip, deskripsi) VALUES ('`+id+`',' IP `+ip+` is `+status+`') `;
        con.query(sqlinsrt, function (err, result) {
            if (err) throw err;
            // console.log(result);
        });

  }


