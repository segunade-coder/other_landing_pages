import mysql from "mysql";
// mysql apache credentials for connecting to xampp without database
import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });
const db_cred: {
  host: string,
  user: string,
  password: string,
  database: string,
  port: number,
}
  = {
  host: process.env.DATABASE_HOST || '',
  user: process.env.DATABASE_USER || '',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || '',
  port: parseInt(process.env.MYSQL_PORT || "3306"),
};
// create a database connection with the credentials above
const connection = mysql.createConnection(db_cred);

//connect to the apache server
connection.connect((err) => {
  if (err) {
    console.log("App started. Error connecting to database", err);
    console.log(
      "Error connecting to apache database",
      __filename,
      // new Error()?.stack?.match(/(:[\d]+)/)[0]?.replace(":", "")
    );
    throw err;
  } else {
    // logToFile("App started. Connected to apache server successfully");
    // console.log("connected to apache database...");
  }
});

// export the connection
export default connection;
