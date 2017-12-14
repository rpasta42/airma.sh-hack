keystate = {}

attack = "FIRE"
// attack = "SPECIAL"
attackDist = 100


if (Players.getMe().type == 2) {
  // Goliath
  attackDist = 100
  moveDist = 30
  attack = "SPECIAL"
  attackAngle = 0.5
}

if (Players.getMe().type == 4) {
  // Tornado
  attackDist = 300
  moveDist = 100
  attack = "SPECIAL"
  attackAngle = 0.3
}


if (Players.getMe().type == 3) {

  // HELO
  attackDist = 500
  moveDist = 160
  attack = "FIRE"
  attackAngle = 0.6
}


resetTime = 8000
tickTime = 200

tau = Math.PI * 2

if (!dupcount) {
  var dupcount = 0;
}
var yescount = 0
lastReset = new Date()
function send(t, yesno) {

  if (!(t in keystate) || keystate[t] != yesno) {
    keystate[t] = yesno
    // console.log(t in keystate, keystate[t])
    // console.log(t, yesno)
    Network.sendKey(t, yesno)
    yescount++;
  } else {
    dupcount++;
  }

  if (new Date() - lastReset > resetTime) {
    keystate = {};
    console.log('Sending rate ' + yescount/resetTime*1000 + 'packets/s')
    yescount = 0
    lastReset = new Date()
  }
}



function step() {
  let me = Players.getMe()
  // console.log(me)
  myTeam = me.team

  idsList = []
  idsObj = Players.getIDs()
  for (prop in idsObj) {
    if (hasOwnProperty.call(idsObj, prop)) {
      idsList.push(prop);
    }
  }
  // console.log(idsList)

  closestEnemy = undefined
  closestDistance = 99999999;
  for (idid in idsList) {
    let player = Players.get(idsList[idid])
    // console.log(player.name)
      // console.log(player)
    if (player !== undefined && /* player.lowResPos.x - player.pos.x < 500 && player.lowResPos.y - player.pos.y < 500 &&*/ !player.stealthed && player.id != me.id/* && player.type == 1*/) {
      // console.log(player.timedout)

      if (player.team != myTeam) {
        xDist = (player.pos.x - me.pos.x)
        yDist = (player.pos.y - me.pos.y)

        playerDistance = Math.sqrt( xDist*xDist + yDist*yDist )
        if (playerDistance < closestDistance) {
          // console.log('New closest is ' + player.name + ' distance: ' + closestDistance)
          closestDistance = playerDistance;
          closestEnemy = player;
        }
      }
    }
  }
  // console.log(closestEnemy)
  // console.log(closestDistance)

  if (closestEnemy != undefined) {
    xDist = (closestEnemy.pos.x - me.pos.x)
    yDist = (-closestEnemy.pos.y - (-me.pos.y))
    yCart = yDist
    dv = new Vector(xDist, yCart)
    // console.log(xDist, yDist)

    // desiredAngle = dv.angle() + Math.PI
    // console.log()
    // console.log(closestEnemy.pos, me.pos, closestEnemy.pos.x, me.pos.x , yDist, xDist)
    // desiredAngle = (((dv.angle() + Math.PI / 2) % tau) + tau) % tau
    // desiredAngle = -dv.angle() - Math.PI
    // rotation = desiredAngle = (desiredAngle % tau + tau) % tau;

    desiredNormalizedAngle = ((-Math.atan2(yCart, xDist) + Math.PI/2) % tau + tau) % tau
    // console.log()
    // console.log(((-Math.atan2(yCart, xDist) + Math.PI/2) % tau + tau) % tau)

    // console.log(dv.angle())



    angleDiff = desiredNormalizedAngle - me.rot;
    // Normalize the rotation to left or right
    angleDiff > Math.PI && (angleDiff -= 2 * Math.PI),
    angleDiff < -Math.PI && (angleDiff += 2 * Math.PI);

    let absAngleDiff = Math.abs(angleDiff)
    var rotationDelay = Math.round(Math.abs(angleDiff) / (60 * config.ships[me.type].turnFactor) * 1e3);

    console.log(closestEnemy.pos.x, me.pos.x)
    console.log(closestEnemy.pos.x, me.pos.x, "Y", closestEnemy.pos.y, me.pos.y)
    console.log("Target " + closestEnemy.name + "#" + closestEnemy.id + " " + Math.round(closestDistance) + "m", "Delta: " + absAngleDiff, "Vector rotation: " + Math.round(desiredNormalizedAngle*100)/100, "My rotation:" + Math.round(me.rot*100)/100)
    // console.log(absAngleDiff)


    if (closestDistance < attackDist && absAngleDiff < attackAngle) {
      send(attack, true)
    } else {
      send(attack, false)
    }

    // if (closestDistance < 50 && absAngleDiff < 0.3) {
    //   // send("DOWN", true)
    // } else
    if (closestDistance > moveDist) {
      send("UP", true)
      // send("DOWN", false)
    } else {
      send("UP", false)
      // send("DOWN", false)
    }

    // console.log(angleDiff)
    if (absAngleDiff < 0.2) {
      // console.log('On point')
      // console.log(closestDistance)

      send("RIGHT", false)
      send("LEFT", false)
    } else {
      if (angleDiff > 0) {
        send("RIGHT", true)
        send("LEFT", false)

        if (rotationDelay < tickTime) {
          setTimeout(function() {
            send("RIGHT", false)
          }, rotationDelay)
        }

        // if (rotationDelay < tickTime - 10) {
        //   setTimeout(function() {
        //     send("RIGHT", false)
        //   }, rotationDelay)
        // }
      } else {
        send("LEFT", true)
        send("RIGHT", false)

        if (rotationDelay < tickTime) {
          setTimeout(function() {
            send("LEFT", false)
          }, rotationDelay)
        }

        // if (rotationDelay < tickTime - 10) {
        //   setTimeout(function() {
        //     send("LEFT", false)
        //   }, rotationDelay)
        // }
      }
    }
  } else {
    console.log('No enemies!')
  }

}
step();


cancel = false
run = function(seconds) {
  i = 0;
  let countedStep = function() {
    if (cancel) {
      cancel = false;
      send('FIRE', false)

      send("UP", false)

      send("RIGHT", false)

      send("LEFT", false)

    } else {
      send("UP", false)

      // step();
      i++;
      if (i < seconds*1000/tickTime) {
        setTimeout(countedStep, tickTime);
      }
    }
  };
  countedStep();

}

$(window).on("keydown", function(i) {
  if (i.which == 27) {
    cancel = true;
  }
})

run(300)
