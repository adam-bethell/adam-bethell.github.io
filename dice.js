$(function() {
    $("#dice_submit").on("click", function() {
        let equation = $("#dice_input").val();
        let clac = parse_dice_equation(equation);
        $("#dice_output").empty();
        $("#dice_output").append(clac);
    });

    function parse_dice_equation(equation) {
        let rolled_matches = [];

        // Roll dice
        let dice_matches = equation.matchAll(/([0-9]+)[dD]([0-9]+)/g);
        let dice_match = dice_matches.next();
        while (!dice_match.done) {
            let match = dice_match.value;
            let rolls = roll_dice(match);
            match["rolls"] = rolls;
            rolled_matches.push(match);
            dice_match = dice_matches.next();
        }

        // Replace text
        let equation_html = equation;

        for (let i = 0; i < rolled_matches.length; i++) {
            let match = rolled_matches[i];
            equation = equation.replace(match[0], "(" + match["rolls"].join("+") + ")");
            equation_html = equation_html.replace(match[0], rolled_match_to_html(match));
        }
        let result = eval_equation(equation);

        equation_html += " = " + result.toString();

        return equation_html;
    }

    function roll_dice(dice) {
        let o = []
        let max = dice[2];
        for (let d = 0; d < dice[1]; d++) {
            o.push(roll(max).toString());
        }
        return o;
    }

    function roll(max) {
        return Math.floor(Math.random() * Math.floor(max)) + 1;
    }

    function eval_equation(equation) {
        equation = equation.replace(/[^0-9()+-]/g, "");
        let theInstructions = "return " + equation;
        let F = new Function (theInstructions);
        let result = F();

        return result;
    }

    function rolled_match_to_html(match) {
        let out = [];
        let max = match[2];

        for (let i = 0; i < match["rolls"].length; i++) {
            let roll = match["rolls"][i];
            if (roll == max) {
                out.push("<span class='dice_crit'>" + roll.toString() + "</span>");
            }
            else if (roll == 1) {
                out.push("<span class='dice_botch'>" + roll.toString() + "</span>");
            }
            else {
                out.push(roll.toString());
            }

        }
        return "(" + out.join(" + ") + ")";
    }
});
