import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

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
          every feature, there are three variants (shown by the examples above):
        </Typography>
        <Typography component="div" variant="body1" gutterBottom>
          <ul>
            <li>Three colors: green, red, and purple.</li>
            <li>Three shapes: ovals, squiggles, and diamonds.</li>
            <li>Three shadings: striped, outlined, and filled.</li>
            <li>Three numbers: one, two, and three.</li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          A <em>set</em> is a combination of three cards such that for each of
          the four features, the variants of that feature expressed by the three
          cards are <b>either all the same or all different</b>. For example,
          the three cards shown above form a set, because each feature is
          expressed in all three variants between the cards. You can also have
          sets with some features different and others same. The three cards
          below are another example of a set.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="2010" />
          <SetCard value="2212" />
          <SetCard value="2111" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          In this set, the three cards are identical in shading (outlined) and
          color (red), while being all different in number and shape. In
          general, any subset of features could be all the same among the three
          cards, with the rest of the features being all different. You can
          verify a couple more examples of sets below.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="1221" />
          <SetCard value="1211" />
          <SetCard value="1201" />
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="0200" />
          <SetCard value="1101" />
          <SetCard value="2002" />
        </Typography>
        <Typography variant="body1" gutterBottom>
          However, a triplet of cards needs to be correct in all four features
          to be a set. The three cards below do <b>not</b> form a set, due to
          their color. Two of the cards are red while the third is green, so the
          three colors are neither all the same, nor all different.
        </Typography>
        <Typography component="div" align="center" gutterBottom>
          <SetCard value="2010" />
          <SetCard value="1001" />
          <SetCard value="2022" />
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
          is the number of sets you've taken.
        </Typography>
        <Typography variant="body1" gutterBottom>
          In some rare occasions, there will not be any sets among the 12 cards
          in the playing area. In these cases, the computer will automatically
          will deal out 3 extra cards (for a total of 15), and play will resume
          normally.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>
            That's all there is to the rules of Set, so head back and start
            playing!
          </b>
        </Typography>
      </Paper>
      <Typography variant="body1" align="center">
        <Link component={RouterLink} to="/">
          Return to home
        </Link>
      </Typography>
    </Container>
  );
}

export default HelpPage;
