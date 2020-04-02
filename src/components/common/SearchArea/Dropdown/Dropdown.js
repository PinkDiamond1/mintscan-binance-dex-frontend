import React from "react";
import cn from "classnames/bind";
import styles from "./Dropdown.scss";

import {useHistory} from "src/hooks";
import {_, empty, stringNumCheck} from "src/lib/scripts";
import DisplayIcon from "src/components/common/DisplayIcon";

import symbolNoneSVG from "src/assets/transactions/symbol_none.svg";
import failSVG from "src/assets/transactions/fail_ic.svg";
const cx = cn.bind(styles);

export default function({
	input = "",
	searchType,
	foundAssets = [],
	setSelected = () => {},
	customStyles = {},
	state = {show: false, selected: 0},
	width = null,
}) {
	const history = useHistory();
	const focusedElement = React.useRef(null);

	React.useEffect(() => {
		if (_.isNil(focusedElement.current)) return;

		focusedElement.current.scrollIntoView({block: "nearest"});
	}, [focusedElement, state.selected]);

	const dropdownList = React.useMemo(
		() => (
			<>
				{_.map(foundAssets, (v, i) => (
					<li
						ref={i === state.selected ? focusedElement : null}
						key={v.asset}
						className={cx({selected: i === state.selected})}
						onClick={() => history.replace((!_.includes(history.location.pathname, "/assets/") ? "assets/" : "") + v.asset)}
						onMouseEnter={() => setSelected(i)}>
						<DisplayIcon image={v.assetImg !== "" ? v.assetImg : symbolNoneSVG} size={20} />
						<div className={cx("content")}>
							{v.mappedAsset}
							<span className={cx("name")}>({v.name})</span>
						</div>
					</li>
				))}
			</>
		),
		[foundAssets, setSelected, state.selected, history]
	);

	const finalStyle = React.useMemo(() => {
		if (_.isNil(width)) return customStyles;
		return {...customStyles, width};
	}, [customStyles, width]);

	return (
		<ul className={cx("Dropdown-wrapper", {visible: state.show && (input.length >= 3 || !empty(foundAssets) || stringNumCheck(input))})} style={finalStyle}>
			<div className={cx("defaultText", {visible: empty(foundAssets) || stringNumCheck(input)})}>
				{searchType ? (
					<>
						<span>Search for {searchType}:</span>
						<span>{input}</span>
					</>
				) : (
					<span>
						Not found <img src={failSVG} alt={"fail"} />
					</span>
				)}
			</div>
			{dropdownList}
		</ul>
	);
}
