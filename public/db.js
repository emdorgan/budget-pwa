//Initialize db variable and create a new indexDB request for a 'budget' database

let db;
const request = indexedDB.open("budget", 1)

// creates the object store called "pending" and set autoIncrement to true
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    // if app is online, just check the batabase
    if (navigator.onLine){
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("OOPS! " + event.target.errorCode);
}

function saveRecord(record){
    //create a transaction to our indexDB
    const transaction = db.transaction(["pending"], "readwrite");
    // access our indexDB
    const store = transaction.objectStore("pending");
    // add record
    store.add(record);
}

function checkDatabase(){
    //create a transaction to our indexDB
    const transaction = db.transaction(["pending"], "readwrite");
    // access our indexDB
    const store = transaction.objectStore("pending");
    // use getAll() method to get all the records
    const getAll = store.getAll();
    // Make a POST request to bulk add all transactions in indexDB to the database 
    getAll.onsuccess = function() {
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                //if successful, open a transaction to the indexDB, get the object store, and clear all items
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

// event listener for when the app comes back online
window.addEventListener("online", checkDatabase);