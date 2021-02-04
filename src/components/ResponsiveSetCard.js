import { memo } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  symbol: {
    margin: 3,
  },
  card: {
    boxSizing: "border-box",
    background: "#fff",
    border: `1px solid ${theme.palette.text.primary}`,
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: theme.setCard.background,
    transition: "box-shadow 0.15s",
  },
  clickable: {
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 5px 3px #bbb",
    },
  },
  active: {
    boxShadow: "0px 0px 5px 3px #4b9e9e !important",
  },
}));

const SHAPES = ["squiggle", "oval", "diamond"];
const SHADES = ["filled", "outline", "striped"];

function ResponsiveSymbol(props) {
  const classes = useStyles();
  const theme = useTheme();

  // Override is used to help visualize new colors in color picker dialog.
  const COLORS = props.colorOverride
    ? [
        props.colorOverride.purple,
        props.colorOverride.green,
        props.colorOverride.red,
      ]
    : [theme.setCard.purple, theme.setCard.green, theme.setCard.red];

  const color = COLORS[props.color];
  const shape = SHAPES[props.shape];
  const shade = SHADES[props.shade];

  return (
    <svg
      className={classes.symbol}
      width={props.size}
      height={2 * props.size}
      viewBox="0 0 200 400"
      style={{ transition: "width 0.5s, height 0.5s" }}
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

function ResponsiveSetCard(props) {
  const classes = useStyles();

  // Black magic below to scale cards given any width
  const { width, value, onClick, background, active } = props;
  const height = Math.round(width / 1.6);
  const margin = Math.round(width * 0.035);
  const contentWidth = width - 2 * margin;
  const contentHeight = height - 2 * margin;

  // 4-character string of 0..2
  const color = value.charCodeAt(0) - 48;
  const shape = value.charCodeAt(1) - 48;
  const shade = value.charCodeAt(2) - 48;
  const number = value.charCodeAt(3) - 48;

  return (
    <div
      className={clsx(classes.card, {
        [classes.clickable]: onClick,
        [classes.active]: active,
      })}
      style={{
        width: contentWidth,
        height: contentHeight,
        margin: margin,
        borderRadius: margin,
        background,
        transition: "width 0.5s, height 0.5s",
      }}
      onClick={onClick}
    >
      {[...Array(number + 1)].map((_, i) => (
        <ResponsiveSymbol
          key={i}
          color={color}
          shape={shape}
          shade={shade}
          size={Math.round(contentHeight * 0.36)}
          colorOverride={props.colorOverride}
        />
      ))}
    </div>
  );
}

export default memo(ResponsiveSetCard);
