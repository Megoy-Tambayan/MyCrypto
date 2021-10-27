import React, { useState } from 'react';

import poapImage from '@assets/images/halloween-poap.svg';
import { Body, Box, Button, Heading, LinkApp, Text } from '@components';
import { PoapClaimService } from '@services/ApiService/PoapClaim';
import { claimPromo, getAnalyticsUserID, getPromoPoap, useDispatch, useSelector } from '@store';
import translate, { translateRaw } from '@translations';

export const HalloweenNotification = () => {
  const dispatch = useDispatch();
  const key = 'halloween2021';
  const analyticsId = useSelector(getAnalyticsUserID);
  const promo = useSelector(getPromoPoap(key));
  const [isClaiming, setIsClaiming] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClaim = () => {
    if (isClaiming) {
      return;
    }
    setIsClaiming(true);
    PoapClaimService.claim(analyticsId).then((res) => {
      if (res?.success) {
        dispatch(claimPromo({ key, claim: res.claim }));
      } else {
        setIsError(true);
      }
      setIsClaiming(false);
    });
  };

  const isClaimed = promo?.claimed;

  return (
    <Box variant="rowAlign">
      <Box mr="4">
        <img src={poapImage} />
      </Box>
      <Box mr="2">
        <Heading color="WARNING_ORANGE" fontWeight="bold" fontSize="24px" lineHeight="32px" mt="0">
          {translateRaw('HALLOWEEN_POAP_NOTIFICATION_HEADER')}
        </Heading>
        <Body color="WARNING_ORANGE">{translate('HALLOWEEN_POAP_NOTIFICATION_BODY')}</Body>
      </Box>
      <Box variant="rowCenter" style={{ flexGrow: 1 }}>
        {isError ? (
          <Box variant="columnCenter">
            <Text as="div" color="white" fontSize="2">
              {translateRaw('HALLOWEEN_POAP_ERROR_HEADER')}
            </Text>
            <Text as="div" color="white">
              {translate('HALLOWEEN_POAP_ERROR')}
            </Text>
          </Box>
        ) : !isClaimed ? (
          <Button onClick={handleClaim} loading={isClaiming}>
            {translateRaw('CLAIM_NOW')}
          </Button>
        ) : (
          <Box variant="columnCenter">
            <Text as="div" color="white" fontSize="2">
              {translateRaw('POAP_CLAIM_APPROVED')}
            </Text>
            <LinkApp mt="2" isExternal href={promo!.claim!}>
              {translateRaw('ACCESS_POAP_LINK')}
            </LinkApp>
          </Box>
        )}
      </Box>
    </Box>
  );
};