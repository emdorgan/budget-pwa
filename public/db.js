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

function checkDatabase(){
    //handles reconnection to database
}

// event listener for when the app comes back online
window.addEventListener("online", checkDatabase);