import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import InternalLink from "../components/InternalLink";
import SetCard from "../components/SetCard";

function HelpPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Help
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
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
          To indicate a set in the game interface, you can select three cards
          either by clicking, tapping, or using the following keyboard
          shortcuts, if you prefer.
        </Typography>
        <Typography component="div" variant="body1" gutterBottom>
          <ul>
            <li>
              Select the first twelve cards with keys <code>123qweasdzxc</code>.
            </li>
            <li>
              Select any additional cards with keys <code>rtyfghvbn</code>.
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          On devices with a keyboard, you can also rotate the layout of cards by
          pressing the <code>;</code> key. This also changes the keyboard
          shortcuts, which may be more convenient to use.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
            That's all there are to the rules of Set, so head back and start
            playing!
          </strong>
        </Typography>
      </Paper>
      <Typography variant="body1" align="center" gutterBottom>
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default HelpPage;
