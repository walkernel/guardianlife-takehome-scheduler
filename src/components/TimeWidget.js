import React, {useState, useEffect} from 'react';
import './TimeWidget.css'
function randomInt(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function randomIntRange(start, range){
    return randomInt(start, start+range);
}
const ScheduledItem = (props)=>{
    let style={
        gridColumnStart:props.startTime, 
        gridColumnEnd:props.endTime,
        backgroundColor:props.color

    }
    return(props.startTime?<div className="scheduled-item" style={style}></div>:<></>
    )
}
const ScheduleRow = (props) =>{
    let [validItems, setValidItems] = useState([]);
    const colors=["#50A31D", "#C79300", "#6767B5"]
    useEffect(()=>{
        const minTime = props.cTime;
        const maxTime = props.cTime+70;
        const validItems = props.scheduledItems?.filter(([startTime, endTime, itemState])=>{
            return ((startTime>=minTime&&startTime<maxTime)||(startTime<minTime&&endTime>minTime))
        })
        setValidItems(validItems);
    },[props.cTime,props.scheduledItems])

    return(
        <div className={props.bg===1?"schedule-row schedule-dark":"schedule-row"}>
            {/* First four components are recycled, any more get added afterwards*/}
            <ScheduledItem color={colors[validItems?.[0]?.[2]]} startTime={Math.max(1, validItems?.[0]?.[0]-props.cTime)} endTime={validItems?.[0]?.[1]-props.cTime+1} />
            <ScheduledItem color={colors[validItems?.[1]?.[2]]}startTime={Math.max(1, validItems?.[1]?.[0]-props.cTime)} endTime={validItems?.[1]?.[1]-props.cTime+1} />
            <ScheduledItem color={colors[validItems?.[2]?.[2]]}startTime={Math.max(1, validItems?.[2]?.[0]-props.cTime)} endTime={validItems?.[2]?.[1]-props.cTime+1} />
            <ScheduledItem color={colors[validItems?.[3]?.[2]]}startTime={Math.max(1, validItems?.[3]?.[0]-props.cTime)} endTime={validItems?.[3]?.[1]-props.cTime+1} />
            {validItems?.length>3?validItems?.filter((item, ind)=>ind>3).map(([startTime, endTime, color], ind)=>{
                return <ScheduledItem key={ind} color={colors[color]} startTime={Math.max(1, startTime-props.cTime)} endTime={endTime-props.cTime+1} />
            }):<></>}

            {/* PRE-OPTIMIZATION */ /*this.state.validItems?.map(([startTime, endTime], ind)=>{
                return <ScheduledItem key={ind} startTime={Math.max(1, startTime-props.cTime)} endTime={endTime-props.cTime+1} />
            })*/}
        </div>
    ) 

}
class TimeWidgetContainer extends React.Component{
    constructor(props){
        super(props);
        const maxTime=this.props.maxTime||3000;
        this.state={
            currentTime:0, 
            minTime:0, 
            schedule:[],
            scrollLoc:0, 
            itemStates:[0,0,0]
        }
    }
    generate10(){
        this.setState({scrollLoc:0, schedule:[...Array(10)].map((val,ind)=>this.generateSchedule(this.props.maxTime))}, ()=>this.countItems());
    }
    addLayer(){
        this.setState({schedule:this.state.schedule.concat([this.generateSchedule(this.props.maxTime)])}, ()=>this.countItems());
    }
    countItems(){
        let itemStates = [0,0,0];
        //count how many of each color item there are
        this.state.schedule.forEach(scheduleRow=>scheduleRow.forEach(rowItem=>itemStates[rowItem[2]]++))
        this.setState({itemStates:itemStates});
    }
    generateSchedule(maxTime){
        let schedule = [];
        schedule.push([randomInt(0,30), randomInt(31, 60), randomInt(0,2)]);
        while(schedule[schedule.length-1][0]<maxTime-60){
            const nextItemStart = randomIntRange(schedule[schedule.length-1][1]+1,60)
            const nextItemEnd = randomIntRange(nextItemStart+1, 30);
            schedule.push([nextItemStart, nextItemEnd, randomInt(0, 2)]);
        }
        return schedule;
    }
    render(){
        return(
            <div className="widget-container">
                <div className="widget-head">
                    <div className="head-info">
                        <p className="info info-green">{this.state.itemStates[0]} Completed </p>
                        <p className="info info-yellow">{this.state.itemStates[1]} Pending </p>
                        <p className="info info-purp">{this.state.itemStates[2]} Jeopardy </p>
                        <button className="add-layer" onClick={()=>this.generate10()}>Generate New Schedule </button>
                        <button className="add-layer" onClick={()=>this.addLayer()}>Add Layer</button>
                    </div>
                    <div className="head-timeline">
                        {[...Array(70)].map((item,ind)=><p key={ind} className="tick tick-number">{(ind+this.state.currentTime)%5===0?ind+this.state.currentTime:""}</p>)}
                        {[...Array(70)].map((item,ind)=><><p key={ind}className="tick">|</p></>)}
                        
                    </div>
                </div>
                <div className="widget-body">
                    <div className="body-content">
                        <div className="background-body">
                        {[...Array(70)].map((item,ind)=><><p key={ind} className="tick">{(ind+this.state.currentTime)%5===0?"|":""}</p></>)}

                        </div>
                            {/* rows get recycled,bg changes with scroll to emulate movement*/}
                            <ScheduleRow bg={(this.state.scrollLoc)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc]} />
                            <ScheduleRow bg={(this.state.scrollLoc+1)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+1]} />
                            <ScheduleRow bg={(this.state.scrollLoc)%2}cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+2]} />
                            <ScheduleRow bg={(this.state.scrollLoc+1)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+3]} />
                            <ScheduleRow bg={(this.state.scrollLoc)%2}cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+4]} />
                            <ScheduleRow bg={(this.state.scrollLoc+1)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+5]} />
                            <ScheduleRow bg={(this.state.scrollLoc)%2}cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+6]} />
                            <ScheduleRow bg={(this.state.scrollLoc+1)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+7]} />
                            <ScheduleRow bg={(this.state.scrollLoc)%2}cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+8]} />
                            <ScheduleRow bg={(this.state.scrollLoc+1)%2} cTime={this.state.currentTime} scheduledItems={this.state.schedule[this.state.scrollLoc+9]} />

                        {/* PRE-OPTIMIZATION */ /*this.state.schedule.map((sched,ind)=>{
                            return <ScheduleRow key={ind} cTime={this.state.currentTime} scheduledItems={sched} />
                        })*/}
                    </div>
                    <div className="body-scroll">
                        <input className="v-scroll" type="range" min={10} max={this.state.schedule.length} disabled={this.state.schedule.length<11} onChange={e=>{this.setState({scrollLoc:e.target.value-10})}}/>
                    </div>
                    <div className="foreground-body">
                        <p className="center-line" pointerEvents="none" draggable={false}>|</p> 
                    </div>
                </div>
                <div className="widget-footer">
                    <input className="h-scroll" min={this.state.minTime} max={this.props.maxTime} type="range" value={this.state.currentTime} onDragStart={e=>false} onInput={e=>{e.preventDefault(); this.setState({currentTime:Number(e.target.value)})}} />
                </div>
            </div>
        )
    }
}

export default TimeWidgetContainer;