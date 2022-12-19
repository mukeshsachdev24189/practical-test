import { Box } from "@twilio-paste/core/box";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { MessagingCanvasPhase } from "./MessagingCanvasPhase";
import { AppState, EngagementPhase } from "../store/definitions";
import { PreEngagementFormPhase } from "./PreEngagementFormPhase";
import { LoadingPhase } from "./LoadingPhase";
import { EntryPoint } from "./EntryPoint";
import { innerContainerStyles, outerContainerStyles } from "./styles/RootContainer.styles";

/* eslint-disable */

const getPhaseComponent = (phase: EngagementPhase) => {
    switch (phase) {
        case EngagementPhase.Loading:
            return <LoadingPhase />;
        case EngagementPhase.MessagingCanvas:
            return <MessagingCanvasPhase />;
        case EngagementPhase.PreEngagementForm:
        default:
            return <PreEngagementFormPhase />;
    }
};

export function RootContainer() {
    const { currentPhase, expanded } = useSelector(({ session }: AppState) => ({
        currentPhase: session.currentPhase,
        expanded: session.expanded
    }));
    const [ipDetails, setIpDetails] = useState<any>();
    async function getIP() {
        await fetch('http://edns.ip-api.com/json')
        .then(r =>  r.json())
        .then(async (data) => {
            console.log(data);
            let ip = data.dns.ip;
            console.log(ip);
            await fetch('http://ip-api.com/json/'+ip)
            .then(r1 =>  r1.json())
            .then(async (data1) => {
                console.log(data1);
                setIpDetails(data1);
            })
        });
    }
    useEffect(() => {
        getIP();       
    }, []);

    return (
        <Box>
            <div style={{
                width: '100%',
                height: '100vh'
            }}>
                <table>
                    <tbody>
                        <tr>
                            <th>IP: </th>
                            <td>{ipDetails && ipDetails.query}</td>
                        </tr>
                        <tr>
                            <th>City: </th>
                            <td>{ipDetails && ipDetails.city}</td>
                        </tr>
                        <tr>
                            <th>Country: </th>
                            <td>{ipDetails && ipDetails.country}</td>
                        </tr>
                        <tr>
                            <th>Pincode: </th>
                            <td>{ipDetails && ipDetails.zip}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Box {...outerContainerStyles}>
                {expanded && (
                    <Box data-test="root-container" {...innerContainerStyles}>
                        {getPhaseComponent(currentPhase)}
                    </Box>
                )}
                <EntryPoint />
            </Box>
        </Box>
    );
}
