import { makeStyles, Typography } from '@material-ui/core';
import { Chart } from "react-google-charts";

export const GoogleGraph = () => {
    const classes = useStyles;
    return (
        <Chart
            width={'95%'}
            height={'95%'}
            chartType="Timeline"
            loader={<Typography variant="body1" color="textSecondary">Loading Chart</Typography>}
            data={[
                [
                { type: 'string', id: 'President' },
                { type: 'date', id: 'Start' },
                { type: 'date', id: 'End' },
                ],
                ['Rett', new Date(1789, 3, 30), new Date(1797, 2, 4)],
                ['Fremover', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Høyre frem', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Høyre', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Høyre bak', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Bak', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Venstre bak', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Venstre', new Date(1797, 2, 4), new Date(1801, 2, 4)],
                ['Venstre frem', new Date(1797, 2, 4), new Date(1801, 2, 4)],
            ]}
            options={{
                showRowNumber: false,
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        height: "90%",
        borderRadius: "5px"
    }
  });


   