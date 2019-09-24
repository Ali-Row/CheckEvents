$(document).ready(function() {
    // connect to database
    try {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDCZf8gynrLPgXluYCKJji0N71TrHHSR9k",
            authDomain: "classtest-6cb54.firebaseapp.com",
            databaseURL: "https://classtest-6cb54.firebaseio.com",
            projectId: "classtest-6cb54",
            storageBucket: "classtest-6cb54.appspot.com",
            messagingSenderId: "77999444853"
        };
        firebase.initializeApp(config);

        var database = firebase.database();
    } catch (err) {
        alert("Database connection failed.");
    }
    // ===========================================================
    // locally stores user a unique id 
    // localStorage.setItem('id', database.ref().child('data').push().key);
    // =================================================
    // clear local storage unique id to test as new user
    // localStorage.clear();
    // use existing unique userKey to pull data and test returning user experience...
    // localStorage.setItem('UniqueUserId', '-LbR6BxBLel84VvGrCe_');
    // =================================================

    // declare global variables
    let userKey,
        userZip;
    let userInterests = [];
    // if unique key is stored locally and exists... 
    if (localStorage.getItem('UniqueUserId')) {
        // store it in a reusable variable...
        var uid = localStorage.getItem('UniqueUserId');
        // test to make sure this variable works...
        console.log(uid);
        // access the database to check for a value/key...
        database.ref('data').on('value', gotData);
        // hoists a function that catched the data..
        function gotData(data) {
            // make a variable that stores the keys/url paths on database
            var keys = Object.keys(data.val());
            console.log(keys);
            // if the key in database matches the uid on local storage...
            if (keys.indexOf(uid) != -1) {
            // test log to see if statement properly works...
            console.log('This key exists!');
            // test log shoutd print database keys...
            console.log(Object.keys(data.val()));
            // acces the user's data associated with their uid...
            database.ref('data').child(uid).on('value', function(obj){
                // test log the uid's data...
                console.log(obj.val());
                // place the uid's data in a variable...
                var userObj = obj.val();
                // another test log of the uid's data...
                console.log(userObj);
                // test log that we can retrieve the user's interests. Since it is an array, use .length to see if we can get how many interests there are...
                console.log(userObj['interests'].length);
                // test log that we can retieve the user's zip...
                console.log(userObj['zip']);
                // console.log('=======================');
                // set the userKey to the uid...
                userKey = uid;
                // loop through the database's array of interests and store them into a global variable...
                for (var i = 0; i < userObj['interests'].length; i++) {
                    // push each interest retrieved from the database into userInterests variable...
                    userInterests.push(userObj['interests'][i]);
                }
                // test log that data grab was successful...
                console.log(userInterests);
                // grab the database's stored zip and store it globally...
                userZip = userObj['zip'];
                // test log zip retrieval success...
                console.log(userZip);

            });
            
            // call function to check the checkboxes the user is interested in
            checkInterest(userInterests);
            // call function to load the user's last zip input
            checkZip(userZip);
        }
        } console.log('why doesn\'t this print?');
        
    } else {
        // test that it does not exist by logging it...
        console.log('local storage id does not exist');
        // store the new unique id provided by the database to local storage...
        localStorage.setItem('UniqueUserId', database.ref().child('data').push().key);
        // declare a global variable 'userKey' to be the same as the retrieved unique id retrieved from the database and stored to local storage...
        userKey = localStorage.getItem('UniqueUserId');
        // test that the ids are being stored correctly by logging both to the console...
        console.log('Had to create a new local storage id. It is: ' + localStorage.getItem('UniqueUserId'));
        // ...
        console.log('new user key is: ' + userKey);
    }

    // tests to see if retrieving user data is successfully global...
    gatheredData(userKey, userInterests, userZip);
    function gatheredData() {
        // wait for the data to be retrieved from database
        setTimeout(function() {
            console.log('===== GATHERED DATA =====');
            console.log(userKey);
            console.log(userInterests);
            console.log(userZip);
        }, 5000 ); // waits 5 seconds before test logging
    }
    // ===========================================================

    // set a global variable that stores all 24 categories used in meetup's API...
    // var categories = ['Outdoors & Adventure', 'Tech', 'Family', 'Health & Wellness', 'Sports & Fitness', 'Learning', 'Photography', 'Food & Drink', 'Writing', 'Language & Culture', 'Music', 'Movements', 'LGBTQ', 'Film', 'Sci-Fi & Games', 'Beliefs', 'Arts', 'Book Clubs', 'Dance', 'Pets', 'Hobbies & Crafts', 'Fashion & Beauty', 'Social', 'Career & Business'];
    let categories = [
        "Outdoors",
        "Cooking",
        "Arts and Crafts",
        "Academic",
        "Sports",
        "Theater",
        "Engineering",
        "STEM",
        "Art design",
        "Child Care",
        "Computer",
        "Astronomy",
        "Geology",
        "Martial Arts",
        "Fishing",
        "Running"
      ];
    // use a for loop to dynamically generate check box input fields for each category...
    for (var i = 0; i < categories.length; i++) {
        // generate half on one side...
        if (i < categories.length / 2) {
            // generate a bootstrap checkbox...
            var form1 = $(`
            <div class="form-check">
                <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="${categories[i]}" name="interests[]">${categories[i]}</label>
            </div>
            `);
            // spawn the generated html to the page...
            $('#interests1').append(form1);
        } else { // ...and the other half on the next side...
            // generate a bootstrap checkbox...
            var form2 = $(`
            <div class="form-check">
                <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="${categories[i]}" name="interests[]">${categories[i]}</label>
            </div>
            `);
            // spawn the generated html to the page...
            $('#interests2').append(form2);
        }
    }
    // ===========================================================
    // dynamically check the check boxes from grabbed stored data of userInterests...
    function checkInterest(interested) {
        for (var i = 0; i < interested.length; i++) {
            // test log 
            console.log('User has ' + interested.length + ' interests.');
            var interest = interested[i];
            // for each interest, we want to target that interest's checkbox, and check it
            $(`input[value='${interest}']`).prop('checked', true);
        }
    }
    // dynamically fill in the zipcode from grabbed stored data of zip...
    function checkZip(zip) {
        $('#zipCodeInput').val(zip);
    }
    // ===========================================================
    // obtain reference to checkboxes named 'interests[]'
    var interests = $('input[name="interests[]"]');
    // test 'interests' are being successfully retreived. Should print that it is an object (array)
    console.log('here are the interests: ' + interests);
    // capture all inputs when #check_events_button is clicked. Use event delegation since the check_events_button will be checking for elements that exist dynamically...
    $(document).on('click', '#checkEventsButton', function(event) {
        event.preventDefault();
        triggerEvent();
    });
    // trigger click if 'Enter' is pressed
    $(document).keypress(function(e) {
        // e.preventDefault();
        // if the enter key is pressed
        if (e.which === 13) {
            // trigger #check_events_button click event 
            // $(document > '#check_events_button').click();
            console.log('Enter button was pressed!');
            triggerEvent();
        }
    });

    function triggerEvent() {
        // empty the array of interests to recapture the updated checkboxes...This will prevent from doubling the interests by adding do the array...
        userInterests = [];
        // test logs that the array has been emptied. Should print 0...
        console.log('Retrieved ' + userInterests.length + ' interests from user');
        // prevent button from self click...
        event.preventDefault();
        // capture each user checked interest
        for (var i = 0; i < interests.length; i++) {
            // test log that each interest is being looped through...
            console.log(interests[i].value);
            // if that interest is checked
            if (interests[i].checked) {
                // test log that it was checked...
                console.log(interests[i].value + ' was checked');
                // push the checked interest into the userInterests array...
                userInterests.push(interests[i].value);
            }
        }
        // test userInterests has updated from emptied array to containing values...
        console.log('User interests has updated to ' + userInterests.length + ' interests...');

        // get user's zip code input...
        let userZip = $('#zipCodeInput').val().trim();
        // test log captured zip input...
        console.log(userZip, userInterests);
        // call a declared function that will store captured input into the database, passing in the user's input...
        storeUserData(userZip, userInterests);

        // declare a function that will add the user's input to the database under their unique id/userKey...
        function storeUserData(zip, interests) {
            // store the passed data into an object for that will be stored under the user's uid in the database...
            let userData = {
                // set a key relative to the data...
                zip: zip,
                interests: interests
            };
            // test log that userData was successfully generated...
            console.log(userData);
            
            // declare an empty object variable that will be used as a cargo to pass in updated data to the database...
            var updates = {};
            // create a database key/url pathway that will hold the users stored data...
            updates['/data/' + userKey] = userData;
            // test log the cargo-object and it's content...
            console.log(updates);
            // inform user that their info will do stored. Could ask permission to store their info onto database by swapping the alert() function to a confirm() function...
            alert('We\'ll keep your interests in mind :)');
            // uses firebases's update() function to update the unique database pathway with userData...
            return database.ref().update(updates);
        }
        //---------------------
        // declare an empty array that will hold all of our response data...
        var results = [];

        // // make an ajax call for each interest
        for (let i = 0; i < userInterests.length; i++) {
            
            $.ajax({
                url:
                  `https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search/?radius=50&zip=${userZip}&current_page=1&per_page=12&sort=date_asc&topic=${userInterests[i]}&start_date=2019-04-06..&api_key=x428fd5p5e9xmjfqwngw9fag`,
                method: "GET"
              }).then(function(data) {
                console.log(data);
                console.log(data.results[i].assetName);
                // create a variable to store all of the response's data
                var events = data.results; // will return 12 objs
                // test log events...
                console.log(events.length); // success!!
                // test log the events obj containing 12 sub-objs
                console.log(events);
                // create a for loop that will loop through the events and construct simpler objs
                for (let j = 0; j < events.length; j++) {
                    let tmpObj = {
                        name: events[j].assetName,
                        date: events[j].activityStartDate,
                        org: events[j].organization.organizationName,
                        phone: events[j].componentInUrlAdr.contactPhone,
                        stAddr: events[j].place.addressLine1Txt,
                        city: events[j].place.cityName,
                        state: events[j].place.stateProvinceCode,
                        descr: events[j].assetDescriptions[0].description,
                        lat: events[j].place.latitude,
                        lon: events[j].place.latitude
                    };
                    // push each temporary obj into the global variable
                    results.push(tmpObj);
                }

              }).then(function(){
                console.log('AJAX call #' + i + ' complete. Data was stored...');
              }).then();
        } 

        // declare a function that will sort the results[] by date...
        function sortByClosestDate(arr, prop) {
            return arr.sort(function (a, b) {
                let x = a[prop],
                    y = b[prop];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
        // call that function and store the sorted arr in a new variable...
        sortByClosestDate(results);
        console.log('The results are: '+ results);
      
        // load event options dynamically...
        var eventOptions = $('#eventOptions');
        //======================================
        // needs to load after 7 milli-seconds...until more research is done for async/await, this is a solution...
        setTimeout(function(){
            if (results.length === 0) {
                alert('Sorry, there isn\'t anything happening in your area at the moment');
            }
            for (let i = 0; i < 12; i++) {
                let name = results[i].name,
                    date = results[i].date,
                    descr = results[i].descr,
                    city = results[i].city,
                    state = results[i].state,
                    addr = results[i].stAddr,
                    phone = results[i].phone,
                    org = results[i].org;
                    date = date.substr(0, date.length-9);
                    lon = results[i].lon;
                    lat = results[i].lat;

                    // fix undefined data...
                    if (name === undefined) {
                        name = 'N/A';
                    } else if (date === undefined) {
                        date = 'N/A';
                    } else if (descr === undefined) {
                        descr = 'N/A';
                    } else if (city === undefined) {
                        city = 'N/A';
                    } else if (state === undefined) {
                        state = 'N/A';
                    } else if (addr === undefined) {
                        addr = 'N/A';
                    } else if (phone === undefined) {
                        phone = 'N/A';
                    } else if (org === undefined) {
                        org = 'N/A';
                    } else return;

                    var map = $(`
                    <iframe src="" frameborder="0">${renderMap}</iframe>
                    `);
    
                eventOptions.append(`
                <div class="col-md-5 p-3 border m-2">
                    <div class="row text-center text-light">
                        <div class="col-md-12">
                            <h3>Name: ${name}</h3>
                        </div>
                        <div class="col-md-3"></div>
                        <div class="col-md-12">
                            <p>Date: ${date}</p>
                        </div>
                    </div>
                    <hr class="bg-light">
                    <div class="row text-light">
                        <div class="col-md-12">
                            <p>Orginization: ${org}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 text-light">
                            <p>Name: ${name}</p>
                            <p>Address: ${addr}, ${city}, ${state}</p>
                        </div>
                        <div class="col-md-2"></div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-light rounded-0" id="more_button" data-toggle="modal" data-target="#exampleModal">More</button>
    
                            <div class="modal fade text-body rounded-0 text-center" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                            <div class="modal-content rounded-0">      
                            <div class="modal-body rounded-0 bg-light">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-5 m-auto">
                                        <div class="box"></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>Name: ${name}</h3>
                                    </div>
                                    <div class="col-md-12" id="modal_descr">
                                        <p> Description: ${descr}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p>Name: ${name}</p>
                                        <p>Phone Number: ${phone}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="box"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
            </div>
            </div>
            </div>
                `);
            }
        }, 700);
    }
});