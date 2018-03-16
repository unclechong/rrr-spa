const style = {
    fontSize: 16,
    marginBottom: 10,
    paddingLeft: 10,
    fontWeight: 500,
    lineHeight: '16px'
}

const WrapLabel = ({label, hasBtn}) => {
    return <div style={style}>
        <span>{label}</span>
        {hasBtn?<span style={{float: 'right', paddingRight: 37}}>{hasBtn}</span>:null}
    </div>
}

export default WrapLabel
