/**
 * Created by lashevskiy on 22.08.2018.
 */

import React, { Component } from 'react';
import 'antd/dist/antd.css';
import WrappedHorizontalLoginForm from '../components/HorizontalLoginForm';
import DrawerForm from '../components/DrawerForm';
import CommonGamesContent from '../components/CommonGamesContent';
import { Layout, Menu, Icon, Button, Collapse, List, Avatar, Tooltip, notification, Spin } from 'antd';
const { Header, Content, Sider } = Layout;
const Panel = Collapse.Panel;


const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description
    });
};

export default class GridContainer extends Component {

    state = {
        collapsed: false,
        users: [],
        isNotFoundUser: false,
        commonGames: [],
        isShowSpin: false
    };

    toggle = () => {
        this.setState({ isShowSpin: !this.state.isShowSpin });
    }

    request = (method, params) => {
        const paramsStr = Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
        return fetch(`http://localhost:4740/${method}?${paramsStr}`)
            .then(response => response.json());
    }
    getSteamId = (username) => this.request('getSteamId', { username });
    getPlayerInfo = (steamid) => this.request('getPlayerInfo', { steamid });
    getOwnedGames = (steamid) => this.request('getOwnedGames', { steamid });

    addPlayer(username) {
        this.getSteamId(username)
            .then(({ steamid }) => {
                if(steamid == null) {
                    this.setState({isNotFoundUser: true});
                }
                return this.getPlayerInfo(steamid);
            })
            .then((player) => {
                if(this.state.users.find(el=>el.steamid === player.info.steamid)) {
                    openNotificationWithIcon('warning', 'Внимание!', 'Данный пользователь уже добавлен. Повторное добавление запрещено.')
                } else {
                    this.state.users.push({ ...player, name: player.info.personaname, steamid: player.info.steamid });
                }
                this.toggle();
            });
    }

    searchCommonGames() {
        const request = `steamIds=${this.state.users.filter(p => p.steamid).map(p => p.steamid).join(',')}`

        fetch(`http://localhost:4740/getMutualGames?${request}`)
            .then(r => {
                if (r.status >= 200 && r.status < 300) {
                    return r.json()
                } else {
                    return Promise.reject(new Error(r.statusText))
                }
            })
            .then(mutualGames => {
                this.setState({commonGames: mutualGames});
                this.toggle();
                openNotificationWithIcon('success', 'Успех!', 'Получен результат поиска общих игр.')
            })
            .catch(e => {
            })
    }

    deleteUser(user) {
        this.setState({users: this.state.users.filter(el=>el.steamid !== user.steamid)});
        this.setState({selectedUser: undefined, commonGames: []});
    }

    render(){
        return (
            <div>
                <Layout>
                    <Sider theme="dark" width="300px" style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                        <div style = {{height: '32px', margin: '16px'}}>
                            <Tooltip placement="top" title={this.state.users.length <= 1 ? "Нужно добавить двух игроков" : null}>
                            <Button style={{width: '100%'}} type="primary"
                                    onClick={()=>{
                                        this.toggle();
                                        this.searchCommonGames(this.state.users);
                                    }}
                                    loading = {this.state.isShowSpin}
                                    disabled={this.state.users.length <= 1}
                                    size='large'
                            >
                                Запустить поиск общих игр
                            </Button>
                            </Tooltip>
                        </div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}
                              onClick={(item)=>{
                                  let sel = this.state.users.filter(user=>user.name === item.key)[0];
                                  this.setState({selectedUser: sel});
                              }}
                        >
                            {this.state.users.map((user)=>{
                                return (
                                    <Menu.Item key={user.name}>
                                        <Icon type="user" />
                                        <span className="nav-text">{user.name}</span>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    </Sider>
                    <Layout style={{ marginLeft: 300 }}>
                        <Header style={{ background: '#fff', padding: 0, textAlign: 'center'}}><b>Сервис поиска мультиплеерных игр в Steam для совместной игры</b></Header>
                        <Spin size="large" spinning={this.state.isShowSpin}>
                        <Content style={{ margin: '24px 16px 24px', overflow: 'initial' }}>
                            <Collapse defaultActiveKey={['0', '1']}>
                                <Panel header="Панель добавления игрока для поиска общих игр" key="0">
                                    <p>{'Введите никнейм игрока для его поиска и добавления в список для дальнейшего поиска общих мультиплеерных игр.'}</p>
                                    <WrappedHorizontalLoginForm
                                        users={this.state.users}
                                        isShowSpin={this.state.isShowSpin}
                                        findAndAddUser={(user)=>{
                                            this.toggle();
                                            this.addPlayer(user);
                                        }}/>
                                </Panel>
                                <Panel header="Общая информация о выделенном игроке" key="1">
                                    {this.state.selectedUser &&
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={[{}]}
                                        renderItem={item => (
                                            <List.Item actions={[
                                                <DrawerForm games={this.state.selectedUser && this.state.selectedUser.ownedGames || []}/>,
                                                <Button onClick={()=>window.location.href=this.state.selectedUser.info.profileurl}>Перейти в Steam профиль</Button>,
                                                <Button type="danger" onClick={()=>this.deleteUser(this.state.selectedUser)}>Удалить из списка</Button>
                                            ]}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={this.state.selectedUser.info.avatarfull} />}
                                                    title={this.state.selectedUser.name}
                                                    description={
                                                        <div>
                                                            <p>Количество игр: {this.state.selectedUser.ownedGames.length || 0}</p>
                                                            <p>Steam Id: {this.state.selectedUser.info.steamid}</p>
                                                            <p>{this.state.selectedUser.info.profileurl}</p>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                    }
                                    {!this.state.selectedUser && <div>Для отображения детальной информации необходимо добавить игрока. После чего выбрать необходимого из списка добавленных игроков.</div>}
                                </Panel>
                                <Panel header={"Результаты поиска общих игр ("+this.state.commonGames.length+")"} key="2">
                                    <CommonGamesContent commonGames = {this.state.commonGames} />
                                </Panel>
                            </Collapse>
                        </Content>
                        </Spin>
                    </Layout>
                </Layout>
            </div>
        )
    }
}