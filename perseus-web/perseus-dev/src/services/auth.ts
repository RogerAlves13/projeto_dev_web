import { supabase } from './supabase'

export async function cadastrar(

  email:string,

  senha:string

){

  return await supabase.auth.signUp({

    email,

    password: senha

  })

}

export async function login(

  email:string,

  senha:string

){

  return await supabase.auth.signInWithPassword({

    email,

    password: senha

  })

}

export async function logout(){

  return await supabase.auth.signOut()

}

export async function usuarioAtual(){

  const {

    data

  } = await supabase.auth.getUser()

  return data.user

}
