tpls = { 
    'style': str.strip(f"""
.container {{{{
    display: flex
}}}}
"""),

    'index': str.strip(f"""
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import styles from './style.scss';

export default class {{component_name}} extends React.Component {{{{
    constructor(props) {{{{
        super(props);
    }}}}
    render() {{{{
        return (
            <div class={{{{styles.container}}}}>
                <div />
            </div>
        );
    }}}}
}}}}
"""),

    'test': str.strip(f"""
import React from 'react';
import renderer from 'react-test-renderer';
import {{component_name}} from '../index.js';

it('renders correctly', () => {{{{
    const tree = renderer.create(<{{component_name}} />).toJSON();
    expect(tree).toMatchSnapshot();
}}}});
""")

}