import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';


import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ProgressSpinner } from 'primereact/progressspinner';
import _ from 'lodash';
import '../App.css';

import 'moment/dist/locale/id';
Moment.locale('id');


const moment = extendMoment(Moment);
moment.locale('id');
const getDaysArray = function (s, e) { const a = []; for (const d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };

const PanelPage = ({ profile, getAttendance }) => {
    const [dates, setDates] = useState([moment().startOf('month').toDate(), moment().toDate()]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

    const fetch = () => {
        getAttendance(moment(dates[0]).format('YYYY-MM-DD 00:00:01'), moment(dates[1]).format('YYYY-MM-DD 23:59:59')).then((data) => {
            const range = getDaysArray(dates[0], dates[1]);
            const result = data.data.data

            const list = range.map((r) => {
                const d = moment(r).format('YYYY-MM-DD');
                const abs = _.filter(result.absHist, { attendance_date: d });
                const remark = _.find(result.resRemark, { date: d });
                return { date: d, abs, remark };
            });
            setList(list);
            setLoading(false);
            console.log(list);
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <div>
            <Card title={profile.fullname} style={{ textAlign: 'center' }}>
                <TabView style={{ textAlign: 'center' }} scrollable>
                    <TabPanel header="Attendance">
                        <Calendar touchUI placeholder="Pilih tanggal" value={dates} onChange={(e) => { setDates(e.value) && fetch() }} selectionMode="range" />
                        <Divider />
                        {!loading ? (
                            <div>
                                {list.map((l, i) => (
                                    <Card key={i} title={l.date} subTitle={moment(l.date).format('dddd')} className={`listcard ${l.remark && ['OFF', 'PH'].indexOf(l.remark.remark) != -1 ? 'grey' : (l.abs.length > 1 || !l.remark ? 'green' : 'red')}`}>
                                        <div className='listitem'>
                                            <div className='listitem child'>
                                                <h6>{l.abs[0] ? l.abs[0].shift_id : '-'}</h6>
                                            </div>
                                            <div className='listitem child'>
                                                <h6>JAM MASUK</h6>
                                                <span>{l.abs[0] ? moment(l.abs[0].attendance_time).format('LT') : '-'}</span>
                                            </div>
                                            <div className='listitem child'>
                                                <h6>JAM PULANG</h6>
                                                <span>{l.abs[1] ? moment(l.abs[1].attendance_time).format('LT') : '-'}</span>
                                            </div>
                                            <div className='listitem child'>
                                                <h6>REMARK</h6>
                                                <span>-</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (<ProgressSpinner />)}
                    </TabPanel>
                    {/* <TabPanel header="Profile">
                    </TabPanel> */}
                </TabView>
            </Card>
        </div>
    );
};

export default PanelPage;
