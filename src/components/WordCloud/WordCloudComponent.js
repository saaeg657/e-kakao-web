import React from 'react';
import WordCloud from 'react-d3-cloud';
import log from './log.htm';

var template = { __html: log };

const styles = {
  root: {

  }
};

const data = [
  { text: 'Hey', value: 1000 },
  { text: 'lol', value: 200 },
  { text: 'first impression', value: 800 },
  { text: 'very cool', value: 1000000 },
  { text: 'duck', value: 10 },
];

const fontSizeMapper = word => Math.log2(word.value) * 5;
// const rotate = word => word.value % 360;

class WordCloudComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  };

  componentDidMount() {
    console.log(log);
  }


  render() {
    return (
      <div style={styles.root}>
        <WordCloud
          data={data}
          fontSizeMapper={fontSizeMapper}
          // rotate={rotate}
        />
        <div dangerouslySetInnerHTML={template} />
      </div>
    );
  }
}

export default WordCloudComponent;
