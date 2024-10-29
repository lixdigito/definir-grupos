import React  from "react"
import sortby from 'lodash.sortby'

function convertStringinParticipanteObjects(str) {
    const lines = str.split('\n')
    const linesFormated = lines.map(line => {
        const columns = line.split(';')
        if (columns.length) {
            const object = {}
            for (const index in columns) {
                if (index == 0 ) object.name = columns[index]
                else object[`peso${ index}`] = columns[index]
            }
            return object
        }
        return line
    }) 
    return linesFormated
}

function orderByParticipanteObjetos(linesFormated) {
    if (linesFormated.length) {
        const listKeys = []
        for (const [ key, _] of Object.entries(linesFormated[0])) {
            if (key !== 'name') listKeys.push(key)
        }
        const sorted = sortby(linesFormated, listKeys)
        return sorted
    }
    return []
}

export default function DefinirGrupos() {
    const [stringList, setStringList] = React.useState('')
    const [numberGroups, setNumberGroups] = React.useState(0)
    const [listGroups, setListGroups] = React.useState([])
    const handleInputTextArea = React.useCallback((event) => {
        const value =  event.target.value
        setStringList(value)
        
    }, [setStringList])

    const handleSetNumberGroups = React.useCallback((event) => {
        const value = event.target.value || 0
        setNumberGroups(Number(value))
    }, [setNumberGroups])

    React.useEffect(() =>{
        if (stringList && numberGroups > 0) {
            const linesFormated = convertStringinParticipanteObjects(stringList)
            const participanteObjectOrdened = orderByParticipanteObjetos(linesFormated)
            const groups = []
            let index = 0
            while(index < numberGroups) {
                groups.push([])
                index += 1
            }
            index = 0
            for(const indexParticipante in participanteObjectOrdened) {
                groups[index].push(participanteObjectOrdened[indexParticipante])
                index += 1
                if (index === numberGroups) index = 0
            }
            setListGroups(groups)
        }
    }, [numberGroups, stringList,setListGroups ])
    return (
        <div>
            <div>Informe a quantidade de grupos</div>
            <input type="number" onChange={handleSetNumberGroups} value={numberGroups} min={0}/>
            <div>Cole sua lista :</div>
            <textarea name="textarea" onChange={handleInputTextArea}></textarea>
            <div>
            {listGroups.map((group, index )=> {
                return (
                    <div key={`Group${index}`}>
                        <div>Grupo {index + 1}</div>
                        {group.map(participante => {
                            let concatString = ''
                            for (const [_, value] of Object.entries(participante)) {
                                concatString =  concatString + ` ${value} - - | - - `
                            }
                            return (<div key={concatString}>{concatString}</div>)
                        })}
                        <div>{'     '}</div>
                        <div>{'     '}</div>
                        <div>{'     '}</div>
                    </div>
                    )
                })}
            </div>
        </div>

    )
}

/*
{participantes.map(participante => {
                let concatString = ''
                for (const [_, value] of Object.entries(participante)) {
                    concatString =  concatString + ` ${value}`
                }
                return (<div key={concatString}>{concatString}</div>)
            })} 
                */