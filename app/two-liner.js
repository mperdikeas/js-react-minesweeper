const React = require('react');
const TwoLiner = (props) => {
    return (
        <div>
            {props.lineA}
            <br/>
            {props.lineB}            
        </div>
    );
};

export default TwoLiner;

