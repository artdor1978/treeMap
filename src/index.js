import * as d3 from "d3";
import * as styles from "../styles/index.css";

let app = () => {
	const chart = d3.select("body").append("svg").attr("id", "chart");
	const path = d3.geoPath();
	const legendContainer = chart.append("g").attr("id", "legend");
	const url =
		"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
	const getData = async () => {
		const data = await d3.json(url);
		renderChart(data);
	};
	const renderChart = (data) => {
		const hierarchy = d3
			.hierarchy(data)
			.sum((d) => d.value) //sum every child's values
			.sort((a, b) => b.value - a.value); // and sort them in descending order ;
		const areaWidth = window.innerWidth;
		const areaHeight = window.innerHeight - 40;
		const areaPadding = areaHeight * 0.1;
		chart.attr("width", areaWidth).attr("height", areaHeight);
		const colors = [
			"#1C1832",
			"#9E999D",
			"#F2259C",
			"#347EB4",
			"#08ACB6",
			"#91BB91",
			"#BCD32F",
			"#75EDB8",
			"#89EE4B",
			"#AD4FE8",
			"#D5AB61",
			"#BC3B3A",
			"#F6A1F9",
			"#87ABBB",
			"#412433",
			"#56B870",
			"#FDAB41",
			"#64624F",
		];
		const categories = data.children.map((d) => d.name);
		const colorScale = d3
			.scaleOrdinal() // the scale function
			.domain(categories) // the data
			.range(colors); // the way the data should be shown
		const treemap = d3
			.treemap()
			.size([areaWidth, areaHeight - 80])
			.padding(1);
		const root = treemap(hierarchy);
		//console.log(root);
		chart
			.append("text")
			.text("Movie Sales")
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
			.text("Top 100 Most Sold Movies Grouped by Genre")
			.style("fill", "#006fbe");
		const treeMap = chart.append("g").attr("id", "treemap");
		/*.attr("transform", (d) => "translate(0," + 0 + ")");*/
		treeMap
			.selectAll("#treemap")
			.data(root.leaves())
			.enter()
			/*.selectAll("rect")*/
			.append("rect")
			.attr("class", "tile")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0 + 40)
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("fill", (d) => colorScale(d.data.category))
			.attr("data-name", (d) => d.data.name)
			.attr("data-category", (d) => d.data.category)
			.attr("data-value", (d) => d.data.value);
		treeMap
		.selectAll("#treemap")
			.data(root.leaves())
			.enter()
			.append("text")
			.text((d) => d.data.name)
			.style("fill", "red")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0 + 55);
		const legend = legendContainer
			.selectAll("#legend")
			.data(colorScale.range())
			.enter()
			.append("g")
			.attr("transform", function (d, i) {
				return "translate(0," + (areaHeight - 15) + ")";
			});
		legend
			.append("rect")
			.attr("x", (d, i) => areaPadding + i * 40 + 20)
			.attr("width", 40)
			.attr("height", 20)
			.attr("class", "legend-item")
			.style("fill", (d) => d);
		legendContainer
			.selectAll("text")
			.data(root.leaves())
			.enter()
			.append("text")
			.text((d) => d.data.category)
			.attr("transform", function (d, i) {
				return "translate(0," + (areaHeight - areaPadding / 1.5 + 30) + ")";
			})
			.attr("x", (d, i) => areaPadding + i * 40 + 20)
			.style("fill", "#006fbe");
	};
	return getData();
};

const root = document.querySelector("#root");
root.appendChild(app());
//https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce
