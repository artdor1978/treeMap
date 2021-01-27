import * as d3 from "d3";
import * as styles from "../styles/index.css";

let app = () => {
	const chart = d3.select("body").append("svg").attr("id", "chart");
	const path = d3.geoPath();
	const legendContainer = chart.append("g").attr("id", "legend");
	const tooltip = d3
		.select("body")
		.append("div")
		.attr("id", "tooltip")
		.style("opacity", 0);
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
		const color = d3.scaleOrdinal(d3.schemeSet3);
		const categories = data.children.map((d) => d.name);
		const treemap = d3
			.treemap()
			.size([areaWidth, areaHeight - 80])
			.padding(1);
		const root = treemap(hierarchy);
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
		treeMap
			.selectAll("#treemap")
			.data(root.leaves())
			.enter()
			.append("rect")
			.attr("class", "tile")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0 + 40)
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("fill", (d) => color(d.data.category))
			.attr("data-name", (d) => d.data.name)
			.attr("data-category", (d) => d.data.category)
			.attr("data-value", (d) => d.data.value)
			.on("mouseover", (d, i) => {
				//console.log("ffff",d,"aaaaa",i)
				tooltip.transition().duration(200).style("opacity", 1);
				tooltip
					.html(i.data.name + "<br/>" + i.data.value)
					.style("left", event.pageX - 25 + "px")
					.style("top", event.pageY - 45 + "px")
					.attr("data-value", i.data.value);
			})
			.on("mouseout", function (d) {
				tooltip.transition().duration(500).style("opacity", 0);
			});
		/*treeMap
			.selectAll("#treemap")
			.data(root.leaves())
			.enter()
			.append("text")
			.text((d) => d.data.name)
			.style("fill", "#006fbe")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0 + 55)
			.attr("id", "movieTitle");*/
		const legend = legendContainer
			.selectAll("#legend")
			.data(categories)
			.enter()
			.append("g")
			.attr("transform", function (d, i) {
				return "translate(0," + (areaHeight - 35) + ")";
			});
		legend
			.append("rect")
			.attr("x", (d, i) => 0 + i * 40 + 10)
			.attr("width", 20)
			.attr("height", 20)
			.attr("class", "legend-item")
			.style("fill", (d) => color(d));
		legendContainer
			.selectAll("text")
			.data(categories)
			.enter()
			.append("text")
			.text((d) => d)
			.attr("transform", function (d, i) {
				return "translate(0," + (areaHeight - areaPadding / 1.5 + 30) + ")";
			})
			.attr("x", (d, i) => 0 + i * 40 + 10)
			.style("fill", "#006fbe")
			.attr("id", "legendItem");
	};
	return getData();
};

const root = document.querySelector("#root");
root.appendChild(app());
//https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce
//https://dev.to/hajarnasr/treemaps-with-d3-js-55p7
