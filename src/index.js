import * as d3 from "d3";
import * as topojson from "topojson";
import * as styles from "../styles/index.css";

let app = () => {
	const chart = d3.select("body").append("svg").attr("id", "chart");
	const path = d3.geoPath();
	const legendContainer = chart.append("g").attr("id", "legend");
	const EDUCATION_FILE =
		"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
	const COUNTY_FILE =
		"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
	const getData = async () => {
		const education = await d3.json(EDUCATION_FILE);
		const county = await d3.json(COUNTY_FILE);
		renderChart(education, county);
	};
	const renderChart = (education, county) => {
		const areaWidth = window.innerWidth;
		const areaHeight = window.innerHeight;
		const areaPadding = areaHeight * 0.1;
		const bachelors = d3.extent(education, (d) => d.bachelorsOrHigher);
		const color = d3
			.scaleQuantize()
			.domain(bachelors)
			.range(["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"]);
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("id", "tooltip")
			.style("opacity", 0);
		chart.attr("width", areaWidth).attr("height", areaHeight);
		chart
			.append("text")
			.text("United States Educational Attainment")
			.attr("x", areaWidth / 2)
			.attr("y", areaPadding - 40)
			.attr("id", "title")
			.attr("text-anchor", "middle")
			.style("fill", "#006fbe");
		chart
			.append("text")
			.attr("x", areaWidth / 2)
			.attr("y", areaPadding - 40)
			.attr("text-anchor", "middle")
			.attr("id", "description")
			.attr("dy", "1.5em")
			.text(
				"Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
			)
			.style("fill", "#006fbe");
		chart
			.append("g")
			.attr("class", "counties")
			.selectAll("path")
			.data(topojson.feature(county, county.objects.counties).features)
			.enter()
			.append("path")
			.attr("class", "county")
			.attr("data-fips", (d) => d.id)
			.attr("data-education", function (d) {
				var result = education.filter(function (obj) {
					return obj.fips === d.id;
				});
				if (result[0]) {
					return result[0].bachelorsOrHigher;
				}
				// could not find a matching fips id in the data
				console.log("could find data for: ", d.id);
				return 0;
			})
			.attr("fill", function (d) {
				var result = education.filter(function (obj) {
					return obj.fips === d.id;
				});
				if (result[0]) {
					return color(result[0].bachelorsOrHigher);
				}
				// could not find a matching fips id in the data
				return color(0);
			})
			.attr("d", path)
			.on("mouseover", (d, i) => {
				var result = education.filter(function (obj) {
					return obj.fips === i.id;
				});
				tooltip.transition().duration(200).style("opacity", 1);
				tooltip
					.html(
						result[0].state +
							"<br/>" +
							result[0].area_name +
							"<br/>" +
							result[0].bachelorsOrHigher
					)
					.style("left", event.pageX - 25 + "px")
					.style("top", event.pageY - 45 + "px")
					.attr("data-education", result[0].bachelorsOrHigher);
			})
			.on("mouseout", function (d) {
				tooltip.transition().duration(500).style("opacity", 0);
			});
		const legend = legendContainer
			.selectAll("#legend")
			.data(color.range())
			.enter()
			.append("g")
			.attr("class", "legend-label")
			.attr(
				"transform",
				"translate(" + areaWidth / 2 + "," + areaPadding / 1.5 + ")"
			);
		legend
			.append("rect")
			.attr("x", (d, i) => areaPadding + i * 40 + 20)
			.attr("width", 40)
			.attr("height", 20)
			.style("fill", (d) => d);
		legendContainer
			.selectAll("text")
			.data(
				d3.range(
					bachelors[0],
					bachelors[1],
					(bachelors[1] - bachelors[0]) / color.range().length
				)
			)
			.enter()
			.append("text")
			.text((d) => d.toFixed(2))
			.attr(
				"transform",
				"translate(" + areaWidth / 2 + "," + (areaPadding / 1.5 + 30) + ")"
			)
			.attr("x", (d, i) => areaPadding + i * 40 + 20)
			.style("fill", "#006fbe");
	};
	return getData();
};

const root = document.querySelector("#root");
root.appendChild(app());
