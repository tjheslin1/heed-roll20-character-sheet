on('ready', function() {
    on('chat:message', function(msg) {
        if (msg.type === 'general' && msg.content && msg.rolltemplate === 'default') {
            
            log(`Received message content: ${msg.content}`);

            let charNameMatch = msg.content.match(/{{name=(.*?)}}/);
            let strengthRollMatch = msg.content.match(/{{Strength:=\$\[\[(\d+)\]\]}}/);

            if (charNameMatch && strengthRollMatch) {

                let charName = charNameMatch[1];
                let strengthRollIndex = parseInt(strengthRollMatch[1], 10);

                if (msg.inlinerolls && msg.inlinerolls[strengthRollIndex]) {
                    let strengthRoll = msg.inlinerolls[strengthRollIndex].results.total;

                    sendChat("API", `${charName} made a strength roll: ${strengthRoll}`);
                } else {
                    sendChat("API", `Could not retrieve the roll result for: ${msg.content}`);
                }
            } else {
                sendChat("API", `Could not parse the roll template content: ${msg.content}`);
            }
        }
    });
});

const weapons = {
    "shortsword": {
        1: "No damage",
        2: "1",
        3: "2",
        4: "3",
        5: "4",
        6: "5",
        7: "6",
    }
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
