import React from "react";

const COLORS = ["purple", "green", "red"];
const SHAPES = ["squiggle", "oval", "diamond"];
const SHADES = ["filled", "outline", "striped"];

function Symbol(props) {
  let color = COLORS[props.color];
  let shape = SHAPES[props.shape];
  let shade = SHADES[props.shade];
  return (
    <svg className="symbol" width="36" height="72" viewBox="0 0 200 400">
      <use
        href={"#" + shape}
        fill={shade === "outline" ? "transparent" : color}
        mask={shade === "striped" ? "url(#mask-stripe)" : ""}
      />
      <use href={"#" + shape} stroke={color} fill="none" strokeWidth={14} />
    </svg>
  );
}

function Card(props) {
  // 4-tuple of 0..2
  var [color, shape, shade, number] = props.value;

  let className = "card";
  if (props.selected) className += " selected";

  const styles = props.freeze ? { background: props.freezeColor } : {};

  return (
    <div onClick={props.onClick}>
      <div className={className} style={styles}>
        {[...Array(number + 1)].map((_, i) => (
          <Symbol key={i} color={color} shape={shape} shade={shade} />
        ))}
      </div>
    </div>
  );
}

export default Card;
