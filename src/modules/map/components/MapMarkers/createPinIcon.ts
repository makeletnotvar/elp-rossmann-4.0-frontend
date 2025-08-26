import L from "leaflet";
import { getAlarmColor } from "modules/map/helpers/getAlarmColor";
import "../map.css";

export default ({ name, data, zoom }: MapBuildingPin & { zoom: number }) => {
  const [alarmsCount, maxAlarmPriority, offlineCount] = data;
  const isAlarmActive = alarmsCount !== undefined && alarmsCount > 0;
  const comAlarm = offlineCount !== undefined && offlineCount > 0;
  const fillColor = getAlarmColor(isAlarmActive, comAlarm, maxAlarmPriority);
  const codeRegex = /\[(\d+)\]/;
  const nameRegex = /\[\d+\]\s*(.*)/;
  const matchCode = name.match(codeRegex);
  const matchName = name.match(nameRegex);

  const htmlIcon = `
  	<div class="m-p-v2"  style="background-color: ${fillColor}; position: relative">
    ${alarmsCount > 0 ? `<div class="badge-pin">${alarmsCount || 0}</div>` : ""}
		<svg enable-background="new 0 0 512 512" height="32" viewBox="0 0 512 512" width="32">
			<g id="_x32_3"><path id="XMLID_214_" d="m256 32.31c85.36 0 154.53 69.2 154.53 154.53 0 64-114.82 220.49-154.53 292.07-38.07-68.7-154.53-231.83-154.53-292.07 0-85.33 69.2-154.53 154.53-154.53zm69.07 148.71c0-38.03-31.02-69.05-69.07-69.05-38.02 0-69.04 31.02-69.04 69.05 0 38.02 31.02 69.04 69.04 69.04 38.05 0 69.07-31.02 69.07-69.04z">
			</path>
			</g>
		</svg>
    ${matchCode && zoom > 10 ? `<div class="pin-name">${matchCode[1]}</div>` : ""}
    ${matchCode && matchName && zoom > 12 ? `<div class="pin-name"><span style="font-weight: 600">${matchCode[1]}</span> ${matchName[1]}</div>` : ""}
	</div>
`;

  //   const htmlIcon = comAlarm
  //     ? `
  // 		<svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" id="mdi-map-marker" viewBox="0 0 25 25">
  // 			<g>
  // 				<ellipse stroke="null" fill-opacity="0.75" ry="12" rx="12" id="svg_3" cy="12" cx="12" fill="#7a7d82"/>
  // 				<ellipse stroke="null" ry="11" rx="11" id="svg_3" cy="12" cx="12" fill="#7a7d82"/>
  // 				<path style="fill: #303030D9" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
  // 			</g>
  // 		</svg>
  // 		`
  //     : isAlarmActive
  //     ? `
  // 			${alarmsCount ? `<div class="badge-pin">${alarmsCount || 0}</div>` : ""}
  // 			<svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" id="mdi-map-marker" viewBox="0 0 25 25">
  // 				<g>
  // 					<ellipse stroke="null" fill-opacity="0.75" ry="12" rx="12" id="svg_3" cy="12" cx="12" fill="${fill}"/>
  // 					<ellipse stroke="null" ry="11" rx="11" id="svg_3" cy="12" cx="12" fill="${fill}"/>
  // 					<path style="fill: #303030D9" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
  // 				</g>
  // 			</svg>
  // 		`
  //     : `
  // 		<svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" id="mdi-map-marker" viewBox="0 0 25 25">
  // 			<g>
  // 				<ellipse stroke="null" fill-opacity="0.75" ry="12" rx="12" id="svg_3" cy="12" cx="12" fill="#7a7d82"/>
  // 				<ellipse stroke="null" ry="11" rx="11" id="svg_3" cy="12" cx="12" fill="#7a7d82"/>
  // 				<path style="fill: #303030D9" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
  // 			</g>
  // 		</svg>
  // 		`;

  return new L.DivIcon({
    className: "",
    iconAnchor: [16, 8],
    popupAnchor: [-5, -21],
    iconSize: [32, 32],
    html: htmlIcon,
  });
};
