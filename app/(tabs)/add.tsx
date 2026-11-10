import React,{useState,useCallback} from "react";
import {Modal,View,Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { router,useFocusEffect } from "expo-router";
import { Page, Title, Copy, Button, Label,colors } from "../../src/ui";
export default function Add() {
  const [open,setOpen]=useState(true);
  useFocusEffect(useCallback(()=>{setOpen(true);},[]));
  function close(){setOpen(false);router.navigate('/(tabs)');}
  return (
    <Page>
      <Label>NOVO POGLAVJE</Label>
      <Title>Kaj želiš ohraniti?</Title>
      <Copy>Začni z glasom, besedo ali trenutkom v fotografiji.</Copy>
      <Button title="Dodaj spomin" onPress={()=>setOpen(true)}/>
      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
      <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'#0009'}}>
      <Pressable accessibilityLabel="Zapri izbor" style={{flex:1}} onPress={close}/>
      <SafeAreaView edges={['bottom']} style={{backgroundColor:colors.panel,borderTopLeftRadius:32,borderTopRightRadius:32,padding:26,gap:18}}>
      <View style={{width:40,height:4,borderRadius:4,backgroundColor:colors.border,alignSelf:'center'}}/>
      <Title>Kaj želiš ohraniti?</Title>
      {[
        ["audio", "Posnemi zgodbo"],
        ["text", "Napiši spomin"],
        ["image", "Dodaj fotografijo"],
        ["video", "Dodaj video"],
      ].map(([type, title]) => (
        <Button
          key={type}
          title={title}
          secondary={type !== "audio"}
          onPress={() => {setOpen(false);router.push({ pathname: "/create", params: { type } });}}
        />
      ))}
      <Button title="Prekliči" secondary onPress={close}/>
      </SafeAreaView></View></Modal>
    </Page>
  );
}
