on('ready', function() {
    on('chat:message', function(msg) {
        if (msg.type === 'general' && msg.content && msg.rolltemplate === 'default') {
            
            log(`Received message content: ${msg.content}`);
            
            if (msg.content.includes('rolled an attack with')) {

                let charNameMatch = msg.content.match(/{{name=(.*?)}}/);
                let rollMatch = msg.content.match(/{{(Strength|Wisdom):=\$\[\[(\d+)\]\]}}/);
                let weaponIndexMatch = msg.content.match(/\(WeaponIndex=(\d)\)/);
    
                if (charNameMatch && rollMatch && weaponIndexMatch) {
    
                    let charName = charNameMatch[1];
                    let rollIndex = parseInt(rollMatch[2], 10);
                    let weaponIndex = weaponIndexMatch[1];
                    
                    if (msg.inlinerolls && msg.inlinerolls[rollIndex]) {
                        let roll = msg.inlinerolls[rollIndex].results.total;
                        
                        let character = findObjs({
                            _type: "character",
                            name: charName
                        })[0];
                        
                        if (character) {
                            let weapon = getAttrByName(character.id, `attack_${weaponIndex}_desc`);
                            
                            let resultTable;
                            if (weapons[weapon] !== undefined) {
                                resultTable = weapons[weapon];
                            } else {
                                sendChat("API", `/w gm Weapon lookup failed for: ${weapon}`);
                                return;
                            }
                            
                            let keys = Object.keys(resultTable).map(Number);
                            let maxKey = Math.max(...keys);
                            
                            if (roll < 1) {
                                roll = 1;
                            } else if (roll > maxKey) {
                                roll = maxKey;
                            }
                            
                            let result = resultTable[roll];

                            let weaponDie;
                            if (weaponDice[weapon] !== undefined) {
                                weaponDie = weaponDice[weapon];
                            } else {
                                sendChat("API", `/w gm Weapon Dice lookup failed for: ${weapon}`);
                                return;
                            }

                            sendChat("Result", result);

                            rollAgain(weaponDie, resultTable, result);
                        } else {
                            sendChat("API", `/w gm Character not found: ${charName}`);
                        }
                    } else {
                        sendChat("API", `/w gm Could not retrieve the roll result for: ${msg.content}`);
                    }
                } else {
                    sendChat("API", `/w gm Could not parse the roll template content: ${msg.content}`);
                }
            }
        }
    });
});

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollAgain(weaponDie, resultTable, result) {
    if (result.includes("roll again")) {
        let roll = rollDice(weaponDie);
        let newResult = resultTable[roll];

        sendChat("Result", newResult);

        return rollAgain(weaponDie, resultTable, newResult);
    } else {
        return;
    }
}

const weaponDice = {
    "None": 1,
    "Unarmed": 8,
    "Shortsword": 4,
    "Axe": 4,
    "Dagger": 8,
    "Flail":4,
    "Broadsword": 4,
    "TwoShortswords": 4,
    "Battleaxe": 6,
    "Warhammer": 6,
    "Flamberge": 6,
    "Anastasia": 6,
    "Spear": 6,
    "KastromancersSpear": 6,
    "G----H-----": 4,
    "G----C-----": 4,
    "Sling": 4,
    "Shortbow": 4,
    "Crossbow": 4,
};

const weapons = {
    "None": {
        1: "No damage",
    },
    "Unarmed": {
        1: "No damage",
        2: "No damage",
        3: "1 bludgeoning",
        4: "1 bludgeoning",
        5: "1 bludgeoning",
        6: "1 bludgeoning or <i>Shove</i>",
        7: "2 bludgeoning or <i>Shove</i>",
        8: "2 bludgeoning or <i>Shove</i> or <i>Grapple</i>",
        9: "2 bludgeoning or <i>Shove</i> or <i>Grapple</i>",
        10: "2 bludgeoning or <i>Shove</i> or <i>Grapple</i>",
    },
    "Shortsword": {
        1: "No damage",
        2: "1 piercing",
        3: "2 piercing",
        4: "3 piercing",
        5: "4 piercing",
        6: "5 piercing",
        7: "6 piercing + <i>roll again</i>",
    },
    "Axe": {
        1: "No damage",
        2: "1 slashing",
        3: "2 slashing",
        4: "3 slashing",
        5: "4 slashing",
        6: "5 slashing",
        7: "6 slashing + <i>Dismemberment</i>",
    },
    "Dagger": {
        1: "No damage",
        2: "No damage",
        3: "1 piercing",
        4: "1 piercing",
        5: "1 piercing",
        6: "1 piercing",
        7: "2 piercing + <i>roll again</i>",
        8: "2 piercing + <i>roll again</i>",
    },
    "Flail": {
        1: "Wielder takes 2 bludgeoning damage",
        2: "Wielder takes 1 bludgeoning damage",
        3: "5 bludgeoning + 1 to wielder",
        4: "6 bludgeoning",
        5: "7 bludgeoningg",
        6: "8 bludgeoning",
    },
    "Broadsword": {
        1: "No damage",
        2: "No damage",
        3: "No damage",
        4: "5 slashing",
        5: "6 slashing",
        6: "7 slashing + <i>Dismemberment</i>",
        7: "8 slashing + <i>Sweep</i>",
    },
    "TwoShortswords": {
        1: "No damage",
        2: "No damage",
        3: "2 piercing",
        4: "4 piercing + <i>roll again</i>",
        5: "5 piercing + <i>roll again</i>",
        6: "6 piercing + <i>roll again</i>",
        7: "7 piercing + <i>roll again</i>",
    },
    "Battleaxe": {
        1: "No damage",
        2: "No damage",
        3: "4 slashing",
        4: "5 slashing",
        5: "6 slashing",
        6: "7 slashing + <i>Dismemberment</i>",
        7: "8 slashing + <i>Dismemberment</i>",
        8: "9 slashing + <i>Decapitation</i>",
        9: "10 slashing + <i>Decapitation</i>",
    },
    "Warhammer": {
        1: "No damage",
        2: "No damage",
        3: "5 bludgeoning",
        4: "6 bludgeoning",
        5: "7 bludgeoning",
        6: "8 bludgeoning",
        7: "9 bludgeoning",
        8: "10 bludgeoning",
        9: "11 bludgeoning",
    },
    "Flamberge": {
        1: "No damage",
        2: "No damage",
        3: "4 slashing",
        4: "5 slashing",
        5: "6 slashing",
        6: "7 slashing + <i>Dismemberment</i>",
        7: "8 slashing + <i>Dismemberment</i>",
        8: "9 slashing + <i>Sweep</i>",
        9: "10 slashing + <i>Sweep</i>",
    },
    "Anastasia": {
        1: "Wielder is temporarily possessed by the trapped soul inside Anastasia and takes d4 necrotic (self)",
        2: "Wielder reels and takes 1 necrotic (self)",
        3: "5 slashing",
        4: "6 slashing",
        5: "7 slashing",
        6: "8 slashing",
        7: "9 slashing + 1 necrotic siphoned from trapped soul",
        8: "9 slashing + 2 necrotic siphoned from trapped soul",
        9: "9 slashing + 3 necrotic siphoned from trapped soul; target makes a WIS check looking to meet or beat current trapped soul's HP, on fail the new target’s soul is trapped within Anastaysia--a previous trapped soul is lost.",
    },
    "Spear": {
        1: "No damage",
        2: "No damage",
        3: "3 piercing",
        4: "4 piercing",
        5: "5 piercing",
        6: "6 piercing",
        7: "7 piercing + <i>Impale</i>",
        8: "8 piercing + <i>Impale</i>",
        9: "9 piercing + <i>Impale</i>",
    },
    "KastromancersSpear": {
        1: "No damage",
        2: "No damage",
        3: "4 piercing",
        4: "5 piercing",
        5: "6 piercing",
        6: "7 piercing",
        7: "8 piercing + <i>Hyperbolic impale</i>",
        8: "9 piercing + <i>Hyperbolic impale</i>",
        9: "10 piercing + <i>Hyperbolic impale</i>",
    },
    "G----H-----": {
        1: "No damage",
        2: "No damage",
        3: "No damage",
        4: "2 bludgeoning",
        5: "4 bludgeoning",
        6: "6 bludgeoning",
        7: "9 bludgeoning + <i>Slam</i>",
        8: "12 bludgeoning + <i>Slam</i>",
        9: "15 bludgeoning + <i>Slam</i>",
        10: "18 bludgeoning + <i>Slam</i>",
    },
    "G----C-----": {
        1: "No damage",
        2: "No damage",
        3: "No damage",
        4: "3 piercing",
        5: "4 piercing",
        6: "5 piercing",
        7: "6 piercing + <i>Crack</i>",
        8: "7 piercing + <i>Crack</i>",
    },
    "Sling": {
        1: "No damage",
        2: "1 bludgeoning",
        3: "2 bludgeoning",
        4: "3 bludgeoning",
        5: "4 bludgeoning",
    },
    "Shortbow": {
        1: "No damage",
        2: "1 piercing",
        3: "2 piercing",
        4: "3 piercing",
        5: "4 piercing",
        6: "5 piercing",
        7: "6 piercing + <i>roll again</i>",
    },
    "Crossbow": {
        1: "No damage",
        2: "2 piercing",
        3: "3 piercing",
        4: "4 piercing",
        5: "5 piercing",
    },
};

function getAttribute(name, charId) {
    let attr = findObjs({
        name: name,
        _type: 'attribute',
        _characterid: charId
    })[0];
    
    let att = null;
    if (attr) {
        att = attr.get("current");
    }
    
    return att;
}
