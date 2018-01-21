import React, { Component } from "react";
import styled from 'styled-components';

import { Colors } from "../libs/Colors";


type Props = {
  children?: React.Element<*>,
};

const Container = styled.div`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: ${Colors.orange};
`;

export const ViewContainer = ({ children }: Props) => (
  <Container>{children}</Container>
);

ViewContainer.defaultProps = {
  children: null,
};
