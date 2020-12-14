import { memo } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 160,
    height: 100,
    background: "#fff",
    border: `1px solid ${theme.palette.text.primary}`,
    borderRadius: 6,
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    margin: 6,
    backgroundColor: theme.setCard.background,
    transition: "box-shadow 0.15s",
    "&:hover": {
      boxShadow: "0px 0px 5px 3px #bbb",
    },
  },
  selected: {
    boxShadow: "0px 0px 5px 3px #4b9e9e !important",
  },
  active: {
    cursor: "pointer",
  },
  smallCard: {
    width: 38,
    height: 24,
    margin: 3,
    border: "1px solid lightgray",
    borderRadius: 2,
    "&:hover": {
      boxShadow: "0px 0px 2px 1px #bbb",
    },
  },
  symbol: {
    margin: 3,
  },
  smallSymbol: {
    margin: 1,
  },
}));

const SHAPES = ["squiggle", "oval", "diamond"];
const SHADES = ["filled", "outline", "striped"];

function Symbol(props) {
  const classes = useStyles();
  const theme = useTheme();

  const COLORS = [theme.setCard.purple, theme.setCard.green, theme.setCard.red];

  const color = COLORS[props.color];
  const shape = SHAPES[props.shape];
  const shade = SHADES[props.shade];
  const width = props.size === "sm" ? 8 : 36;
  const height = props.size === "sm" ? 16 : 72;
  let className = classes.symbol;
  if (props.size === "sm") className += " " + classes.smallSymbol;
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 400"
    >
      <use
        href={"#" + shape}
        fill={shade === "outline" ? "transparent" : color}
        mask={shade === "striped" ? "url(#mask-stripe)" : ""}
      />
      <use href={"#" + shape} stroke={color} fill="none" strokeWidth={18} />
    </svg>
  );
}

function SetCard(props) {
  const classes = useStyles();

  // 4-character string of 0..2
  const color = props.value.charCodeAt(0) - 48;
  const shape = props.value.charCodeAt(1) - 48;
  const shade = props.value.charCodeAt(2) - 48;
  const number = props.value.charCodeAt(3) - 48;

  let className = classes.card;
  if (props.selected) className += " " + classes.selected;
  if (props.onClick) className += " " + classes.active;
  if (props.size === "sm") className += " " + classes.smallCard;
  const styles = props.color ? { background: props.color } : {};

  return (
    <div onClick={props.onClick} className={className} style={styles}>
      {[...Array(number + 1)].map((_, i) => (
        <Symbol
          key={i}
          color={color}
          shape={shape}
          shade={shade}
          size={props.size}
        />
      ))}
    </div>
  );
}

export default memo(SetCard);
