/**
 * Created by lashevskiy on 22.08.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

import { List } from 'antd';

export default class CommonGamesContent extends Component {
    render(){
        return (
            <div>
                {this.props.commonGames.length > 0 ?
                    <List
                        dataSource={this.props.commonGames}
                        pagination={{
                            onChange: (page) => {
                                /*console.log(page);*/
                            },
                            pageSize: 10,
                        }}
                        renderItem={item => (<List.Item>{item.name}</List.Item>)}
                    />
                    :
                    <div>Общих игр нет.</div>
                }
            </div>
        )
    }
}

CommonGamesContent.propTypes = {
    commonGames: PropTypes.array.isRequired
};

CommonGamesContent.defaultProps = {
    commonGames: []
};