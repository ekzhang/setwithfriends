import { useContext } from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import InternalLink from "../components/InternalLink";
import SetCard from "../components/SetCard";
import { SettingsContext } from "../context";
import { BASE_RATING, SCALING_FACTOR, standardLayouts } from "../util";

function HelpPage() {
  const { keyboardLayout } = useContext(SettingsContext);

  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Help
      </Typography>

      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="h5" gutterBottom>
          Rules
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Set with Friends! This web app allows you to play Set, the
          popular real-time card game designed by Marsha Falco in 1974 (
          <Link href="https://en.wikipedia.org/wiki/Set_(card_game)">
            Wikipedia
          </Link>
          ). The game is a race to find as many <em>sets</em>, or three-card
          triplets with a certain property, as possible from among the cards in
          the playing area. In this online variant, this is as simple as
          clicking on the three cards when you find a set, and the computer will
          handle all the details of dealing cards and keeping score.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you haven't played before, don't worry! We'll explain the rules
          below.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1120" />
          <SetCard value="2011" />
          <SetCard value="0202" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          Set is played with a special deck of 81 = 3×3×3×3 cards. You can see
          some examples of Set cards above. Each card has four features that
          distinguish it from the others: color, shape, shading, and number. For
          each feature, there are three variants, as shown in the example.
        </Typography>
        <Typography component="div" variant="body1" gutterBottom>
          <ul>
            <li>Three colors: green, red/orange, and purple.</li>
            <li>Three shapes: ovals, squiggles, and diamonds.</li>
            <li>Three shadings: striped, outlined, and filled.</li>
            <li>Three numbers: one, two, and three.</li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          A <em>set</em> is a combination of three cards such that for each of
          the four features, the variants of that feature expressed by the three
          cards are <strong>either all the same or all different</strong>. For
          example, the three cards shown above form a set, because each feature
          is expressed in all three variants between the cards. You can also
          have sets where some features are different and others are the same.
          The three cards below also form a set.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0010" />
          <SetCard value="0212" />
          <SetCard value="0111" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          In the example above, the three cards are identical in shading
          (outlined) and color (purple), while being all different in number and
          shape. In general, some subset of features could be all the same among
          the three cards, with the rest of the features being all different.
          You can verify a couple more examples of sets below.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="2221" />
          <SetCard value="2211" />
          <SetCard value="2201" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0200" />
          <SetCard value="1101" />
          <SetCard value="2002" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          However, a triplet of cards needs to be correct in all four features
          to be a set. The three cards below do <strong>not</strong> form a set,
          due to their color. Two of the cards are green while the third is
          purple, so the three colors are neither all the same, nor all
          different.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1010" />
          <SetCard value="0001" />
          <SetCard value="1022" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          You should practice these rules a few times until you've mastered
          them.
        </Typography>
        <Typography variant="body1" gutterBottom>
          To play Set, 12 cards are dealt from the deck. When a player finds a
          set, they take those three cards from the playing area, and three new
          cards are dealt to replace the ones that were taken. The game ends
          when the deck is empty and no more sets are available, and your score
          is equal to the number of sets you've found.
        </Typography>
        <Typography variant="body1" gutterBottom>
          In some rare occasions, there will not be any sets among the 12 cards
          in the playing area. In these cases, the computer will automatically
          deal out 3 extra cards (for a total of 15), and play will resume
          normally. In even rarer cases when there are no sets among these 15
          cards, additional cards will be dealt out in multiples of 3.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
            That's all there are to the rules of Set, so head back and start
            playing!
          </strong>
        </Typography>

        <hr />

        <Typography variant="h5" gutterBottom>
          Controls and layout
        </Typography>
        <Typography variant="body1" gutterBottom>
          To indicate a set in the game interface, you can select three cards
          either by clicking, tapping, or using the following keyboard
          shortcuts, if you prefer.
        </Typography>
        <Typography component="div" variant="body1" gutterBottom>
          <ul>
            <li>
              Select the first twelve cards with keys{" "}
              <code>
                {standardLayouts[keyboardLayout].verticalLayout.slice(0, 12)}
              </code>
              .
            </li>
            <li>
              Select any additional cards with keys{" "}
              <code>
                {standardLayouts[keyboardLayout].verticalLayout.slice(12)}
              </code>
              .
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          On devices with a keyboard, you can also rotate the cards by pressing
          the{" "}
          <code>{standardLayouts[keyboardLayout].orientationChangeKey}</code>{" "}
          key and change the card layout (between portrait and landscape) by
          pressing the{" "}
          <code>{standardLayouts[keyboardLayout].layoutChangeKey}</code> key.
          The latter also changes the keyboard shortcuts, which may be more
          convenient to use.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you are using a different keyboard layout than{" "}
          <code>{keyboardLayout}</code>, you can enjoy using the same keyboard
          shortcuts by selecting your keyboard layout in the settings. The
          shortcuts specific to your layout will then be reflected here.
        </Typography>

        <hr />
        <Typography variant="h5" gutterBottom>
          Game modes
        </Typography>
        <Typography variant="body1" gutterBottom>
          For experienced players, there are many interesting variations on the
          standard Set game. Currently this site lets you play two of these
          variants: <em>Set-Chain</em> and <em>UltraSet</em>. Here's how.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Set-Chain
        </Typography>
        <Typography variant="body1" gutterBottom>
          Playing Set-Chain is almost the same as playing Set normally. The only
          difference is that after you pick the first set, every new set should
          include <strong>exactly one card from the previous set</strong>. For
          example, the first three sets of a game might look as follows:
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1210" />
          <SetCard value="0101" />
          <SetCard value="2022" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="2022" />
          <SetCard value="0011" />
          <SetCard value="1000" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0011" />
          <SetCard value="0212" />
          <SetCard value="0110" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          In this case, the first card in the second set is the third card from
          the first set, and the first card in the third set is the second card
          from the second set.
        </Typography>
        <Typography variant="h6" gutterBottom>
          UltraSet
        </Typography>
        <Typography variant="body1" gutterBottom>
          In UltraSet, you should pick out four cards (instead of three) at a
          time. The first pair and the second pair of these four cards should
          form a set <strong>with the same additional card</strong>. For
          example, one valid choice of the four cards could be:
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1202" />
          <SetCard value="1122" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0212" />
          <SetCard value="2112" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          The first pair consists of the two cards in the first row, and the
          second pair consists of the two cards in the second row. The "fifth"
          card, which does not need to be present on the board, is drawn below.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1012" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          These four cards form an ultraset, because both of the following are
          valid regular sets.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1202" />
          <SetCard value="1122" />
          <SetCard value="1012" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0212" />
          <SetCard value="2112" />
          <SetCard value="1012" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          Note that you do not have to select the four cards in any particular
          order while playing.
        </Typography>

        <hr />

        <Typography variant="h5" gutterBottom>
          Rating system
        </Typography>
        <Typography variant="body1" gutterBottom>
          Set with Friends includes a rating system based on the well known Elo
          system. The system assigns a number to every player, and updates its
          value based on your performance compared to your opponents. The
          ratings are tracked separately for each game mode.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Like in chess, each player initially starts with a rating of{" "}
          {BASE_RATING}. The update to each player's rating is based on the
          fraction of the sets they obtain, and the ratings of the other players
          in the game. Let{" "}
          <em>
            R<sub>i</sub>
          </em>{" "}
          be the rating of player <em>i</em>. In the calculation of the expected
          ratio of sets obtained, we scale the ratings exponentially such that a
          player with a rating {SCALING_FACTOR} points higher is expected to
          obtain approximately 10 times as many sets.{" "}
          <em>
            Q<sub>i</sub>
          </em>
          , the exponentially scaled rating of player <em>i</em>, is computed
          using
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          <em>
            Q<sub>i</sub> = 10
            <sup>
              R<sub>i</sub> / {SCALING_FACTOR}
            </sup>
            .
          </em>
        </Typography>
        <Typography variant="body1" gutterBottom>
          For each player in a game, we then compute the expected ratio of sets
          for that player using the formula
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          <em>
            E<sub>i</sub> = Q<sub>i</sub> / (Σ Q<sub>j</sub>){", "}
          </em>
        </Typography>
        <Typography variant="body1" gutterBottom>
          where{" "}
          <em>
            Σ Q<sub>j</sub>
          </em>{" "}
          is a sum over the exponentially scaled ratings of all players in the
          game.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Finally, we compute the updated rating,{" "}
          <em>
            R<sub>i</sub>'
          </em>
          , for each player using the formula
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          <em>
            R<sub>i</sub>' = R<sub>i</sub> + K·(S<sub>i</sub> - E<sub>i</sub>)
            {", "}
          </em>
        </Typography>
        <Typography variant="body1" gutterBottom>
          where{" "}
          <em>
            S<sub>i</sub>
          </em>{" "}
          is the achieved ratio of sets obtained by player <em>i</em> and{" "}
          <em>K</em> is an additional factor based on your level of experience.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Note that while the rating is displayed as an integer, it is stored
          and computed as a floating-point number.
        </Typography>
      </Paper>
      <Typography
        variant="body1"
        align="center"
        style={{ marginTop: 12, paddingBottom: 12 }}
      >
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default HelpPage;
