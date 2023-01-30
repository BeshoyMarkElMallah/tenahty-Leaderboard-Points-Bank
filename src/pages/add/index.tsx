import { Grid } from '@geist-ui/core';
import { NextPage } from 'next';
import React from 'react'
import TextInput from './TextInput';

const Add: NextPage = () => {
    return (
        <Grid xs={24}>
            <TextInput uiType={"default"}
                title={"Age"}
                placeholder={"Enter a value between 1 and 110"}
                type={"number"}
                value="0"
                onChange={(e: { target: { value: string | undefined | number} }) => {
                    console.log("age", e.target.value);

                }}
            />
        </Grid>
    );
}

export default Add;