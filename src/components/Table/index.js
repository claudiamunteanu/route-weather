import {Content, Wrapper} from "./Table.styles";
import {WEATHER_ICON_URL} from "../../config";
import {
    capitalizeFirstLetter,
    celsiusToFahrenheit, hPaToinHg,
    meterPerSecToKmPerHour, meterPerSecToMilesPerHour,
    timestampToFormattedDateTime
} from "../../helpers";
import ConfirmModal from "../Modals/ConfirmModal";
import FormModal from "../Modals/FormModal";
import PropTypes from "prop-types";

const TableHeadItem = ({item}) => {
    if(item.heading.includes("Button"))
        return <th/>
    return <th>{item.heading}</th>
}

TableHeadItem.propTypes = {
    item: PropTypes.object
}

const TableRow = ({item, column, itemIndex, text, temperatureUnit, pressureUnit, precipUnit, windSpeedUnit}) => {
    return (
        <tr>
            {column.map((columnItem, index) => {
                let cell = ''
                if(columnItem.heading.includes("Button")){
                    const callback = columnItem.value
                    let  triggerText, modalTitle
                    switch (columnItem.heading) {
                        case `${text?.myAccount.updateDrivingTip.button}Button`:
                            triggerText = text?.myAccount.updateDrivingTip.button
                            modalTitle = text?.myAccount.updateDrivingTip.title
                            let callbackText = text?.myAccount.updateDrivingTip.save
                            return <td key={itemIndex * column.length + index}><FormModal text={text} triggerText={triggerText} modalTitle={modalTitle} callbackText={callbackText} callback={callback} drivingTip={item} updateDrivingTip={true}/> </td>
                        case `${text?.myAccount.deleteDrivingTip.button}Button`:
                            triggerText = text?.myAccount.deleteDrivingTip.button
                            modalTitle = text?.myAccount.deleteDrivingTip.title
                            let modalText = text?.myAccount.deleteDrivingTip.text
                            return <td key={itemIndex * column.length + index}><ConfirmModal triggerText={triggerText} text={text} modalTitle={modalTitle} modalText={modalText} callback={() => callback(item)}/> </td>
                        default:
                    }
                }

                if (columnItem.value.includes('.')) {
                    const itemSplit = columnItem.value.split('.')
                    cell = item[itemSplit[0]]
                    for (let i = 1; i < itemSplit.length; i++) {
                        if (itemSplit[i].includes('[')) {
                            const propSplit = itemSplit[i].split('[');
                            cell = cell[propSplit[0]]
                            cell = cell[propSplit[1].charAt(0)]
                        } else {
                            cell = cell[itemSplit[i]];
                        }
                    }
                } else {
                    cell = item[`${columnItem.value}`]
                }

                switch (columnItem.heading) {
                    case '':
                        let url = `${WEATHER_ICON_URL}${cell}@2x.png`
                        return <td key={itemIndex * column.length + index}><img src={url} alt="WeatherIcon"  height='50' width='50'/></td>
                    case text?.headers.time: cell = timestampToFormattedDateTime(cell); break;
                    case 'Temp.': case text?.statistics.headers.minTemp: case text?.statistics.headers.maxTemp:
                        switch (temperatureUnit){
                            case '°F':{
                                cell = celsiusToFahrenheit(cell);
                                break;
                            }
                            default:
                                break;
                        }
                        cell = cell + temperatureUnit
                        break;
                    case text?.headers.clouds: case text?.statistics.headers.humidity:
                        cell = cell + '%';
                        break;
                    case text?.headers.wind:
                        switch (windSpeedUnit){
                            case 'km/h':{
                                cell = meterPerSecToKmPerHour(cell);
                                break;
                            }
                            case 'mph':{
                                cell = meterPerSecToMilesPerHour(cell);
                                break;
                            }
                            default:
                                break;
                        }
                        cell = cell + " " + windSpeedUnit;
                        break;
                    case 'Precip.':
                        cell = Math.round(cell * 100) + '%';
                        break;
                    case text?.myAccount.headers.number:
                        cell = itemIndex + 1; break;
                    case text?.myAccount.headers.categories:
                        cell = cell.map(item => capitalizeFirstLetter(item.toLowerCase())).join(", ");
                        break;
                    case text?.statistics.headers.pressure:
                        switch (pressureUnit){
                            case 'inHg':{
                                cell = hPaToinHg(cell);
                                break;
                            }
                            default:
                                break;
                        }
                        cell = cell + " " + pressureUnit;
                        break;
                    case text?.statistics.headers.rain:
                        switch (precipUnit){
                            case 'in':{
                                cell = hPaToinHg(cell);
                                cell = cell + " " + precipUnit;
                                break;
                            }
                            case 'l/m^2':{
                                cell = cell + " l/m";
                                return <td key={itemIndex * column.length + index}>{cell}<sup>2</sup></td>
                            }
                            default:
                                cell = cell + " " + precipUnit;
                                break;
                        }
                        break;
                    case text?.statistics.headers.weather:{
                        cell = text?.weatherTypes[cell.toLowerCase()]
                        break;
                    }
                    default:
                        break;
                }
                return <td key={itemIndex * column.length + index}>{cell}</td>
            })}
        </tr>
    )
}

TableRow.propTypes = {
    item: PropTypes.object,
    column: PropTypes.array,
    itemIndex: PropTypes.number,
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    pressureUnit: PropTypes.string,
    precipUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

const Table = ({text, data, column, temperatureUnit, pressureUnit, precipUnit, windSpeedUnit}) => {
    return (
        <Wrapper>
            <Content>
                <table>
                    <thead>
                    <tr>
                        {column.map((item, index) => <TableHeadItem key={index} item={item}/>)}
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => <TableRow temperatureUnit={temperatureUnit} precipUnit={precipUnit} pressureUnit={pressureUnit} windSpeedUnit={windSpeedUnit} text={text} key={index} item={item} column={column} itemIndex={index}/>)}
                    </tbody>
                </table>
            </Content>
        </Wrapper>
    )
}

Table.propTypes = {
    column: PropTypes.array,
    data: PropTypes.array,
    text: PropTypes.object,
    temperatureUnit: PropTypes.string,
    pressureUnit: PropTypes.string,
    precipUnit: PropTypes.string,
    windSpeedUnit: PropTypes.string
}

export default Table