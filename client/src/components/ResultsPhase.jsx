export const ResultsPhase = (props) => {


    return (
        <>
            {props.error_feedback ?
                <h3>Problemi {props.error_feedback}</h3>
                :
                <h3>RISULTATI</h3>
            }
        </>
    )
}