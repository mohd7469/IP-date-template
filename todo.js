var IP;
var IPFound = true;
var systemIP;
var fullIP;
//get the IP addresses associated with an account
function getIPs(callback){
  var ip_dups = {};

  //compatibility for firefox and chrome
  var RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection
    || window.webkitRTCPeerConnection;
  var useWebKit = !!window.webkitRTCPeerConnection;

  //bypass naive webrtc blocking using an iframe
  if(!RTCPeerConnection){
    //NOTE: you need to have an iframe in the page right above the script tag
    //
    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    //<script>...getIPs called in here...
    //
    var win = iframe.contentWindow;
    RTCPeerConnection = win.RTCPeerConnection
      || win.mozRTCPeerConnection
      || win.webkitRTCPeerConnection;
    useWebKit = !!win.webkitRTCPeerConnection;
  }

  //minimal requirements for data connection
  var mediaConstraints = {
    optional: [{RtpDataChannels: true}]
  };

  var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

  //construct a new RTCPeerConnection
  var pc = new RTCPeerConnection(servers, mediaConstraints);

  function handleCandidate(candidate){
    //match just the IP address
    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
    var ip_addr = ip_regex.exec(candidate)[1];

    //remove duplicates
    if(ip_dups[ip_addr] === undefined)
      callback(ip_addr);

    ip_dups[ip_addr] = true;
  }

  //listen for candidate events
  pc.onicecandidate = function(ice){

    //skip non-candidate events
    if(ice.candidate)
      handleCandidate(ice.candidate.candidate);
  };

  //create a bogus data channel
  pc.createDataChannel("");

  //create an offer sdp
  pc.createOffer(function(result){

    //trigger the stun server request
    pc.setLocalDescription(result, function(){}, function(){});

  }, function(){});

  //wait for a while to let everything done
  setTimeout(function(){
    //read candidate info from local description
    var lines = pc.localDescription.sdp.split('\n');

    lines.forEach(function(line){
      if(line.indexOf('a=candidate:') === 0)
        handleCandidate(line);
    });
  }, 1000);
}

setTimeout(function () {
  fullIP = "("+systemIP+") ("+IP+")";
//  console.log(fullIP);

},2000);
//insert IP addresses into the page
getIPs(function(ip){
  IP = ip;
  if(IPFound){
    systemIP = ip;
    IPFound=false;
  }
//  console.log('IP : ' + IP);
});

var objToday = new Date(),
  weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
  dayOfWeek = weekday[objToday.getDay()],
  domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
  dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
  months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
  curMonth = months[objToday.getMonth()],
  curYear = objToday.getFullYear(),
  curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
  curMeridiem = objToday.getHours() > 12 ? " PM" : " AM";
var today = curHour + ":" + curMinute + ":" + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " " + curMonth + ", " + curYear;
/**
 * Created by MTA on 5/3/2015.
 */
var app = angular.module("todo", ["firebase"]);
app.constant("MY_FIREBASE_URL", "https://demosaylani.firebaseio.com/messages");

app.controller("counterCtrl", function ($scope, $firebaseArray, MY_FIREBASE_URL) {
  var ref = new Firebase(MY_FIREBASE_URL);
  var messages = $firebaseArray(ref);
  $scope.counter ={
    date: today
  };
  $scope.saveTask = function () {
//    console.log($scope.counter.date);
    var today=$scope.counter.date;
//    messages.$add($scope.counter);
    setTimeout(function () {
      messages.$add({date:today,IP:fullIP});
    },3000)

    setTimeout(function () {
      for(var i=0;i<messages.length;i++){
        console.log($scope.counter[i]);
      }
    },4000)

  };

  $scope.removeTask = function (taskDetails) {
    $scope.counter.$remove(taskDetails);
    console.log(messages.length-1 + ' left');
  };

  $scope.saveTask();
  $scope.counter = $firebaseArray(ref);

//  setTimeout(function () {
//    for(var i=0;i<messages.length;i++){
//      console.log($scope.counter[i]);
//    }
//  },5000);

});
