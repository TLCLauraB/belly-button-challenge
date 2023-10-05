// Define the URL of the Belly Button Biodiversity Dataset
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and handle it in the callback
d3.json(url).then(function(data) {

  // Extract individual IDs
  const individualIDs = data.names;

  // Populate the dropdown menu
  const dropdown = d3.select("#selDataset");
  individualIDs.forEach((id) => {
    dropdown.append("option").text(id).attr("value", id);
  });

  // Event listener for the dropdown menu to trigger the optionChanged function
  d3.select("#selDataset").on("change", function() {
    const selectedID = this.value;
    optionChanged(selectedID, data);
  });

  // Define the optionChanged function to create/update the data
  function optionChanged(selectedID, data) {
    const selectedData = data.samples.find((sample) => sample.id === selectedID);

    // Create or update the Bar Chart
    updateCharts(selectedData);

    // Create or update the Bubble Chart
    createBubbleChart(selectedData);

      // Display Metadata
  displayMetadata(selectedID, data);

    // Get the Washing Frequency from Metadata
    const metadata = data.metadata.find((meta) => meta.id === parseInt(selectedID));
    const washingFrequency = metadata.wfreq;
  
    // Update the Gauge Chart
    createGaugeChart(washingFrequency);
}

  // Define a function to create the Bubble Chart
  function createBubbleChart(selectedData) {
    const trace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      mode: 'markers',
      text: selectedData.otu_labels,
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: 'Viridis' 
      }
    };

    const layout = {
      title: 'Bubble Chart for Sample Data',
      xaxis: { title: 'OTU IDs' },
      yaxis: {}
    };

    Plotly.newPlot('bubble', [trace], layout);
  }

  // Define a function to create/update the bar chart
  function updateCharts(selectedData) {
    const top10OTUs = selectedData.sample_values.slice(0, 10);
    const otuIDs = selectedData.otu_ids.slice(0, 10);
    const otuLabels = selectedData.otu_labels.slice(0, 10);

    const trace = {
      x: top10OTUs.reverse(),
      y: otuIDs.map((id) => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h",
    };

    const layout = {
      title: `Top 10 OTUs for Individual ${selectedData.id}`,
      xaxis: {},
    };

    Plotly.newPlot("bar", [trace], layout);
  }

// Define a function to display Metadata
function displayMetadata(selectedID, data) {
  const metadata = data.metadata.find((meta) => meta.id === parseInt(selectedID));

  // Select the metadata div and clear its content
  const metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html("");

  // Append key-value pairs to the metadata div
  for (const [key, value] of Object.entries(metadata)) {
    metadataDiv.append("p").text(`${key}: ${value}`);
  }
}

// Advanced Challenge Assignment

// Define a function to display washingFrequency
function createGaugeChart(washingFrequency) {
  // Define the Gauge Chart Data and layout
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 4 },
      gauge: {
        axis: { range: [0, 9] },
        steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "lightyellow" },
          { range: [2, 3], color: "lightgreen" },
          { range: [3, 4], color: "lightblue" },
          { range: [4, 5], color: "lightcyan" },
          { range: [5, 6], color: "lightseagreen" },
          { range: [6, 7], color: "mediumseagreen" },
          { range: [7, 8], color: "darkseagreen" },
          { range: [8, 9], color: "forestgreen" },
        ],
      },
    },
  ];


var layout = { width: 600, height: 400, margin: { t: 0, b: 0 } };

  // Plot the gauge chart
  Plotly.newPlot("gauge", data, layout);
}

  // Call the optionChanged function initially to display data
  const initialSelectedID = data.names[0]; 
  optionChanged(initialSelectedID, data); 
});

